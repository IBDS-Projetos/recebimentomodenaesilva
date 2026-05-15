// === CONFIGURAÇÃO SUPABASE (variáveis de ambiente) ===
let SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação de variáveis de ambiente
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ ERRO: Variáveis de ambiente Supabase não configuradas!');
    console.error('📝 Verifique o arquivo .env:');
    console.error('   - VITE_SUPABASE_URL:', SUPABASE_URL ? '✓ Configurado' : '✗ Faltando');
    console.error('   - VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓ Configurado' : '✗ Faltando');
}

let supabaseClient = null;
try {
    // Verificar se supabase está disponível
    if (typeof supabase === 'undefined') {
        throw new Error('Biblioteca Supabase não foi carregada corretamente');
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase conectado com sucesso!');
} catch (error) {
    console.error('❌ Erro ao conectar ao Supabase:', error);
}

try {
    if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
    }
} catch (e) {
    console.warn('⚠️ Erro ao registrar ChartDataLabels:', e.message);
}
let recebimentos = [];
let currentStatusFilter = 'Todos';
let chartStatus, chartForn;

const timeSlots = [];
for (let h = 8; h <= 18; h++) {
    timeSlots.push((h < 10 ? '0' + h : h) + ":00");
    if (h < 18) timeSlots.push((h < 10 ? '0' + h : h) + ":30");
}

// Função auxiliar para obter elemento com segurança
function getElement(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`⚠️ Elemento com ID "${id}" não encontrado no DOM`);
    }
    return el;
}

// ─── Helpers ──────────────────────────────────────────────────────────
function getLocalTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// Formato DD/MM/AA (2-digit year)
function fmtData(dateStr) {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y.slice(2)}`;
}

function parseValor(vUnit) {
    if (vUnit === null || vUnit === undefined || vUnit === '') return 0;
    const valStr = String(vUnit).replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(valStr);
    return isNaN(parsed) ? 0 : parsed;
}

function formatarMoeda(i) {
    let v = i.value.replace(/\D/g, '');
    v = (v / 100).toFixed(2) + '';
    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
    i.value = v;
}

// Expor para uso inline no HTML
window.formatarMoeda = formatarMoeda;

// ─── Verificar Atraso: 24h após data/hora agendada ──────────────────
function checkAtrasado(item) {
    if (item.status === 'Concluído') return false;
    if (!item.dataPrevisao) return false;
    const agora = new Date();
    const [y, mo, d] = item.dataPrevisao.split('-');
    const endTime = item.horarioFim || '23:59';
    const [hh, mm] = endTime.split(':');
    const scheduledEnd = new Date(parseInt(y), parseInt(mo)-1, parseInt(d), parseInt(hh), parseInt(mm));
    const limite = new Date(scheduledEnd.getTime() + 24 * 60 * 60 * 1000);
    return agora > limite;
}

// ─── Sidebar Toggle ───────────────────────────────────────────────────
window.toggleSidebar = function() {
    const sidebar = getElement('sidebar');
    const btnShow = getElement('btnShowSidebar');
    const icon    = getElement('sidebarToggleIcon');
    
    if (!sidebar) return;
    
    const collapsed = sidebar.classList.toggle('collapsed');
    if (btnShow) btnShow.classList.toggle('visible', collapsed);
    if (icon) {
        icon.className = collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left';
    }
};

// ─── Fullscreen ───────────────────────────────────────────────────────
window.expandChart = function(cardId) {
    const el = getElement(cardId);
    if (!el) return;
    if (!document.fullscreenElement) {
        el.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
    } else {
        document.exitFullscreen();
    }
};

document.addEventListener('fullscreenchange', () => {
    [chartStatus, chartForn].forEach(c => { if (c) c.resize(); });
    document.querySelectorAll('.btn-expand-chart i').forEach(icon => {
        icon.className = document.fullscreenElement ? 'fas fa-compress' : 'fas fa-expand';
    });
});

// ─── Dark Mode ────────────────────────────────────────────────────────
window.toggleDarkMode = function() {
    const isDark = document.body.classList.toggle('dark-mode');
    const icon  = getElement('darkModeIcon');
    if (icon) icon.className  = isDark ? 'fas fa-moon' : 'fas fa-sun';
    localStorage.setItem('darkMode', isDark ? '1' : '0');
};

if (localStorage.getItem('darkMode') === '1') {
    document.body.classList.add('dark-mode');
    setTimeout(() => {
        const icon = getElement('darkModeIcon');
        if (icon) icon.className = 'fas fa-moon';
    }, 0);
}

// ─── 1. Buscar dados ─────────────────────────────────────────────────
let _fetchController = null;

async function fetchRecebimentos() {
    if (!supabaseClient) {
        console.error('❌ Supabase não foi inicializado corretamente');
        return;
    }

    if (_fetchController) {
        _fetchController.abort();
    }
    _fetchController = new AbortController();
    const signal = _fetchController.signal;

    try {
        console.log('🔄 Carregando dados do Supabase...');
        const { data, error } = await supabaseClient
            .from('recebimentos')
            .select('*', { signal })
            .order('dataPrevisao', { ascending: false });

        if (signal.aborted) return;

        if (error) {
            console.error("❌ Erro ao carregar dados:", error);
            console.error('Detalhes do erro:', {
                mensagem: error.message,
                codigo: error.code,
                status: error.status
            });
            return;
        }
        
        console.log(`✅ ${data.length} registros carregados com sucesso`);
        recebimentos = data;
        applyFilters();
    } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("❌ Exceção ao buscar dados:", err);
    }
}

// ─── 2. Realtime ──────────────────────────────────────────────────────
let _realtimeTimeout = null;

function setupRealtime() {
    if (!supabaseClient) {
        console.warn('⚠️ Supabase não está inicializado - Realtime desabilitado');
        return;
    }
    
    try {
        supabaseClient
            .channel('tabela-mudancas')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'recebimentos' }, () => {
                if (_realtimeTimeout) clearTimeout(_realtimeTimeout);
                _realtimeTimeout = setTimeout(() => {
                    console.log('🔄 Atualizando dados em tempo real...');
                    fetchRecebimentos();
                }, 500);
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Inscrito em atualizações em tempo real');
                }
            });
    } catch (error) {
        console.warn('⚠️ Erro ao configurar Realtime:', error.message);
    }
}

// ─── 3. updateUI ──────────────────────────────────────────────────────
function updateUI(data) {
    let tQtd = 0, tVal = 0, and = 0, fin = 0, agend = 0;
    const fMap = {};

    const hojeLocalStr = getLocalTodayString();
    const dataAtualEl = getElement('dataAtualTxt');
    if (dataAtualEl) dataAtualEl.innerText = fmtData(hojeLocalStr);

    const agendamentosHoje = recebimentos.filter(r => r.dataPrevisao === hojeLocalStr);

    data.forEach(r => {
        tQtd += parseFloat(r.qtd || 0);
        tVal += parseValor(r.vUnit);
        if (r.status === 'Concluído')    fin++;
        else if (r.status === 'Em Descarga') and++;
        else if (r.status === 'Agendado')    agend++;
        fMap[r.fornecedor] = (fMap[r.fornecedor] || 0) + 1;
    });

    const elTotal = getElement('statTotalRecusas');
    const elAnd = getElement('statAndamento');
    const elQtd = getElement('statQtd');
    const elVal = getElement('statValor');

    if (elTotal) elTotal.innerText = data.length;
    if (elAnd) elAnd.innerText = and;
    if (elQtd) elQtd.innerText = tQtd;
    if (elVal) elVal.innerText = `R$ ${tVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    renderResumoHoje(agendamentosHoje);
    renderTable(data);
    renderCharts(agend, and, fin, fMap);
}

// ─── 4. Resumo Hoje ───────────────────────────────────────────────────
function renderResumoHoje(lista) {
    const container = getElement('containerResumoHoje');
    
    if (!container) {
        console.warn('⚠️ Elemento containerResumoHoje não encontrado');
        return;
    }
    
    if (lista.length === 0) {
        container.innerHTML = `<div class="col-span-full p-6 bg-slate-100 rounded-xl text-center text-slate-400 text-xs font-bold uppercase border-2 border-dashed border-slate-200">Nenhuma entrega prevista para hoje</div>`;
        return;
    }
    container.innerHTML = lista.map(item => `
        <div class="card-hoje p-4 rounded-xl shadow-sm border border-slate-200">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded" style="font-family:Arial,sans-serif;">${item.horarioPrevisto} - ${item.horarioFim || '...'}</span>
                <span class="text-[9px] font-bold uppercase ${item.status === 'Concluído' ? 'text-emerald-500' : 'text-amber-500'}">${item.status}</span>
            </div>
            <h4 class="text-xs font-black text-slate-800 truncate">${item.fornecedor}</h4>
            <p class="text-[10px] text-slate-500 truncate mb-1">${item.prod}</p>
            ${item.observacoes ? `<p class="text-[9px] italic text-slate-400 truncate">Obs: ${item.observacoes}</p>` : ''}
        </div>
    `).join('');
}

// ─── 5. Tabela Principal ──────────────────────────────────────────────
function renderTable(data) {
    const tbody = getElement('tableBody');
    
    if (!tbody) {
        console.warn('⚠️ Elemento tableBody não encontrado');
        return;
    }

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-slate-400 text-xs font-bold uppercase">Nenhum registro encontrado para os filtros selecionados.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item) => {
        const isAtrasado    = checkAtrasado(item);
        const rowClass      = isAtrasado ? 'row-atrasada' : 'hover:bg-slate-50';
        const statusDisplay = isAtrasado ? `${item.status} - ATRASADO` : item.status;
        const statusColor   = isAtrasado
            ? 'bg-red-100 text-red-700'
            : (item.status === 'Concluído'   ? 'bg-green-100 text-green-700' :
               item.status === 'Em Descarga' ? 'bg-blue-100 text-blue-700'  : 'bg-slate-100 text-slate-700');

        const valNumerico = parseValor(item.vUnit);

        return `
            <tr class="${rowClass} transition border-b border-slate-50">
                <td class="px-6 py-4 font-bold text-slate-600">
                    <div class="flex items-center gap-2">
                        ${isAtrasado ? '<i class="fas fa-exclamation-triangle blink-icon" title="Carga Atrasada"></i>' : ''}
                        ${item.fornecedor}
                    </div>
                    ${item.observacoes ? `<div class="text-[9px] font-normal text-slate-400 mt-1 italic">Obs: ${item.observacoes}</div>` : ''}
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold text-slate-800">${item.prod}</div>
                    <div class="text-[10px] font-bold text-slate-400" style="font-family:Arial,sans-serif;">NF: ${item.nfO}</div>
                </td>
                <td class="px-6 py-4" style="font-family:Arial,sans-serif;">
                    <div class="text-[9px] ${isAtrasado ? 'text-red-600' : 'text-indigo-600'} font-bold uppercase">PREV: ${fmtData(item.dataPrevisao)}</div>
                    <div class="text-[10px] font-black uppercase">DAS ${item.horarioPrevisto} ÀS ${item.horarioFim || '--:--'}</div>
                </td>
                <td class="px-6 py-4 font-bold">${item.qtd} VOL <br> <span class="text-emerald-600 italic">R$ ${valNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></td>
                <td class="px-6 py-4">
                    <span class="px-2.5 py-1 rounded-md text-[9px] font-black uppercase ${statusColor}">
                        ${statusDisplay}
                    </span>
                </td>
                <td class="px-6 py-4 text-center space-x-3">
                    <button onclick="editRecusa('${item.id}')" class="text-blue-500 hover:scale-110 transition"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteRecusa('${item.id}')" class="text-slate-300 hover:text-red-500 hover:scale-110 transition"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// ─── 6. Modais ────────────────────────────────────────────────────────
window.openAgendaModal = function() {
    const modal = getElement('agendaModal');
    const dateInput = getElement('checkAgendaDate');
    if (modal) modal.classList.add('active');
    if (dateInput) dateInput.value = getLocalTodayString();
    renderAgendaGrid();
};
window.closeAgendaModal = function() { 
    const modal = getElement('agendaModal');
    if (modal) modal.classList.remove('active');
};

window.openModal = function() {
    const modal = getElement('modal');
    const title = getElement('modalTitle');
    if (!modal) return;
    modal.classList.add('active');
    if (title) title.innerText = "Novo Recebimento";
};
window.closeModal = function() {
    const modal = getElement('modal');
    const form = getElement('recusaForm');
    const index = getElement('editIndex');
    if (!modal) return;
    modal.classList.remove('active');
    if (form) form.reset();
    if (index) index.value = "";
};

// ─── 7. Grade de Disponibilidade ──────────────────────────────────────
window.renderAgendaGrid = function() {
    const dateInput = getElement('checkAgendaDate');
    const tbody = getElement('agendaGridBody');
    
    if (!dateInput || !tbody) {
        console.warn('⚠️ Elementos de agenda não encontrados');
        return;
    }
    
    const dateToLink = dateInput.value;
    if (!dateToLink) { tbody.innerHTML = ""; return; }
    const ocupados = recebimentos.filter(r => r.dataPrevisao === dateToLink);
    tbody.innerHTML = timeSlots.map(time => {
        const agendamento = ocupados.find(o => {
            if (!o.horarioFim) return o.horarioPrevisto === time;
            return time >= o.horarioPrevisto && time < o.horarioFim;
        });
        return `
            <tr class="hover:bg-slate-50">
                <td class="p-3 font-bold text-slate-500 border-r w-24" style="font-family:Arial,sans-serif;">${time}</td>
                <td class="p-3">
                    ${agendamento
                        ? `<span class="text-red-500 font-bold uppercase">OCUPADO: ${agendamento.fornecedor}</span>`
                        : `<span class="text-emerald-500 font-bold uppercase tracking-widest opacity-40">Livre</span>`
                    }
                </td>
            </tr>
        `;
    }).join('');
};

// ─── 8. Gráficos ──────────────────────────────────────────────────────
function renderCharts(agend, and, fin, fMap) {
    if (chartStatus) chartStatus.destroy();
    
    const chartStatusEl = getElement('chartStatus');
    if (!chartStatusEl) return;
    
    chartStatus = new Chart(chartStatusEl, {
        type: 'doughnut',
        data: {
            labels: ['Agendado', 'Em Descarga', 'Concluído'],
            datasets: [{
                data: [agend, and, fin],
                backgroundColor: ['#94a3b8', '#3b82f6', '#10b981'],
                borderWidth: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: true, position: 'right',
                    labels: { boxWidth: 10, font: { size: 9, weight: 'bold', family: 'Arial' }, padding: 10 }
                },
                datalabels: {
                    display: true, color: '#1e293b',
                    font: { weight: 'bold', size: 9, family: 'Arial' },
                    formatter: (value, ctx) => {
                        const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        return (sum > 0 && value > 0) ? (value * 100 / sum).toFixed(0) + "%" : '';
                    }
                }
            }
        }
    });

    if (chartForn) chartForn.destroy();
    const labels = Object.keys(fMap);
    const chartFornEl = getElement('chartFornecedor');

    if (!chartFornEl) return;

    if (labels.length === 0) {
        const ctx = chartFornEl.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '10px Arial';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText('Sem dados para exibir', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }

    chartForn = new Chart(chartFornEl, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: labels.map(l => fMap[l]),
                backgroundColor: '#6366f1',
                borderRadius: 4
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: { display: false },
                x: {
                    ticks: {
                        font: { size: 8, family: 'Arial' },
                        maxRotation: 90,
                        minRotation: 90,
                        autoSkip: false
                    }
                }
            },
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: '#4f46e5',
                    font: { weight: 'bold', size: 10, family: 'Arial' },
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            layout: {
                padding: { top: 20 }
            }
        }
    });
}

// ─── 9. Filtros ───────────────────────────────────────────────────────
function applyFilters() {
    const searchEl = getElement('globalSearch');
    const dateStartEl = getElement('filterDateStart');
    const dateEndEl = getElement('filterDateEnd');
    
    const q = (searchEl?.value || '').toLowerCase();
    const dateStart = dateStartEl?.value || '';
    const dateEnd = dateEndEl?.value || '';
    
    const filtered  = recebimentos.filter(r => {
        const matchSearch = (r.nfO || "").toLowerCase().includes(q)
            || (r.fornecedor || "").toLowerCase().includes(q)
            || (r.prod || "").toLowerCase().includes(q);
        const matchStatus = (currentStatusFilter === 'Todos' || r.status === currentStatusFilter);
        let matchDate = true;
        if (dateStart) matchDate = matchDate && (r.dataPrevisao >= dateStart);
        if (dateEnd)   matchDate = matchDate && (r.dataPrevisao <= dateEnd);
        return matchSearch && matchStatus && matchDate;
    }).sort((a, b) => (b.dataPrevisao || '').localeCompare(a.dataPrevisao || ''));
    updateUI(filtered);
}

window.setStatusFilter = function(status) {
    currentStatusFilter = status;
    const btnMap = {
        'Todos':       { id: 'btnTodos',      color: 'text-indigo-600' },
        'Agendado':    { id: 'btnAgendado',   color: 'text-slate-700' },
        'Em Descarga': { id: 'btnAndamento',  color: 'text-blue-600' },
        'Concluído':   { id: 'btnFinalizado', color: 'text-emerald-600' }
    };
    Object.values(btnMap).forEach(({ id, color }) => {
        const el = getElement(id);
        if (!el) return;
        el.classList.remove('bg-white', 'shadow', color, 'text-indigo-600', 'text-slate-700', 'text-blue-600', 'text-emerald-600');
        el.classList.add('text-slate-500');
    });
    const active = btnMap[status];
    if (active) {
        const el = getElement(active.id);
        if (el) {
            el.classList.remove('text-slate-500');
            el.classList.add('bg-white', 'shadow', active.color);
        }
    }
    applyFilters();
};

// ─── 10. Formulário: Salvar / Atualizar ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Validar se elementos críticos existem
    const form = getElement('recusaForm');
    const modal = getElement('modal');
    const agendaModal = getElement('agendaModal');
    const deleteModal = getElement('deleteConfirmModal');
    const globalSearch = getElement('globalSearch');
    const filterDateStart = getElement('filterDateStart');
    const filterDateEnd = getElement('filterDateEnd');
    const btnConfirmDelete = getElement('btnConfirmDelete');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!supabaseClient) {
                console.error('❌ Erro: Banco de dados não inicializado');
                return;
            }

            const editIndexEl = getElement('editIndex');
            const dbId = editIndexEl?.value || "";
            
            const obj = {
                fornecedor:      getElement('fornecedor')?.value || '',
                prod:            getElement('prod')?.value || '',
                nfO:             getElement('nfO')?.value || '',
                dataSolicitacao: getElement('dataSolicitacao')?.value || '',
                dataPrevisao:    getElement('dataPrevisao')?.value || '',
                horarioPrevisto: getElement('horarioPrevisto')?.value || '',
                horarioFim:      getElement('horarioFim')?.value || '',
                qtd:             getElement('qtd')?.value || '',
                vUnit:           getElement('vUnit')?.value || '',
                status:          getElement('status')?.value || 'Agendado',
                observacoes:     getElement('observacoes')?.value || ''
            };

            try {
                if (dbId === "") {
                    console.log('➕ Inserindo novo registro...');
                    const { data, error } = await supabaseClient.from('recebimentos').insert([obj]);
                    if (error) {
                        console.error("❌ Erro ao salvar:", error);
                        console.error(`Erro ao salvar:\n${error.message}\n\nDica: Verifique se a tabela 'recebimentos' existe no Supabase`);
                        return;
                    }
                    console.log('✅ Registro inserido com sucesso');
                } else {
                    console.log('✏️ Atualizando registro:', dbId);
                    const { error } = await supabaseClient.from('recebimentos').update(obj).eq('id', dbId);
                    if (error) {
                        console.error("❌ Erro ao atualizar:", error);
                        console.error(`Erro ao atualizar:\n${error.message}`);
                        return;
                    }
                    console.log('✅ Registro atualizado com sucesso');
                }
                window.closeModal();
                fetchRecebimentos();
            } catch (err) {
                console.error("❌ Exceção ao salvar/atualizar:", err);
                console.error('Erro ao processar solicitação. Verifique o console.');
            }
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) window.closeModal();
        });
    }
    
    if (agendaModal) {
        agendaModal.addEventListener('click', function(e) {
            if (e.target === this) window.closeAgendaModal();
        });
    }
    
    if (deleteModal) {
        deleteModal.addEventListener('click', function(e) {
            if (e.target === this) closeDeleteModal();
        });
    }
    
    if (globalSearch) {
        globalSearch.addEventListener('input', applyFilters);
    }
    
    if (filterDateStart) {
        filterDateStart.addEventListener('change', applyFilters);
    }
    
    if (filterDateEnd) {
        filterDateEnd.addEventListener('change', applyFilters);
    }

    if (btnConfirmDelete) {
        btnConfirmDelete.addEventListener('click', async () => {
            if (_pendingDeleteId === null) return;
            
            if (!supabaseClient) {
                console.error('❌ Erro: Banco de dados não inicializado');
                return;
            }

            const id = _pendingDeleteId;
            closeDeleteModal();
            
            try {
                console.log('🗑️ Deletando registro:', id);
                const { error } = await supabaseClient.from('recebimentos').delete().eq('id', id);
                if (error) {
                    console.error("❌ Erro ao excluir:", error);
                    console.error(`Erro ao excluir:\n${error.message}`);
                    return;
                }
                console.log('✅ Registro deletado com sucesso');
                fetchRecebimentos();
            } catch (err) {
                console.error("❌ Exceção ao deletar:", err);
                console.error('Erro ao deletar. Verifique o console.');
            }
        });
    }

    // Verifica atrasos a cada 60 segundos (só quando a aba está visível)
    setInterval(() => {
        if (!document.hidden) applyFilters();
    }, 60000);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) applyFilters();
    });

    // Filtro padrão: últimos 15 dias
    const hoje = new Date();
    const quinzeDiasAtras = new Date(hoje);
    quinzeDiasAtras.setDate(hoje.getDate() - 15);
    const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (filterDateStart) filterDateStart.value = fmt(quinzeDiasAtras);
    if (filterDateEnd) filterDateEnd.value = fmt(hoje);

    // INICIALIZAÇÃO
    fetchRecebimentos();
    if (supabaseClient) {
        setupRealtime();
    }
});

// ─── 11. Editar / Excluir ─────────────────────────────────────────────
window.editRecusa = function(id) {
    const item = recebimentos.find(r => r.id == id);
    if (!item) return;
    
    const editIndexEl = getElement('editIndex');
    const modalTitleEl = getElement('modalTitle');
    
    if (editIndexEl) editIndexEl.value = id;
    if (modalTitleEl) modalTitleEl.innerText = "Editar Recebimento";
    
    Object.keys(item).forEach(k => {
        const el = getElement(k);
        if (el) el.value = item[k] ?? '';
    });
    window.openModal();
};

let _pendingDeleteId = null;

function openDeleteModal(id) {
    const modal = getElement('deleteConfirmModal');
    if (!modal) return;
    _pendingDeleteId = id;
    modal.classList.add('active');
}

window.closeDeleteModal = function() {
    _pendingDeleteId = null;
    const modal = getElement('deleteConfirmModal');
    if (!modal) return;
    modal.classList.remove('active');
};

window.deleteRecusa = function(id) {
    openDeleteModal(id);
};

// ─── 12. Exportar Excel ───────────────────────────────────────────────
window.exportFilteredExcel = function() {
    const searchEl = getElement('globalSearch');
    const dateStartEl = getElement('filterDateStart');
    const dateEndEl = getElement('filterDateEnd');
    
    const q = (searchEl?.value || '').toLowerCase();
    const dateStart = dateStartEl?.value || '';
    const dateEnd = dateEndEl?.value || '';
    
    const filtered  = recebimentos.filter(r => {
        const matchSearch = (r.nfO || "").toLowerCase().includes(q)
            || (r.fornecedor || "").toLowerCase().includes(q)
            || (r.prod || "").toLowerCase().includes(q);
        const matchStatus = (currentStatusFilter === 'Todos' || r.status === currentStatusFilter);
        let matchDate = true;
        if (dateStart) matchDate = matchDate && (r.dataPrevisao >= dateStart);
        if (dateEnd)   matchDate = matchDate && (r.dataPrevisao <= dateEnd);
        return matchSearch && matchStatus && matchDate;
    }).sort((a, b) => (b.dataPrevisao || '').localeCompare(a.dataPrevisao || ''));

    if (filtered.length === 0) { console.warn("Não há dados para exportar com os filtros atuais."); return; }
    
    const exportData = filtered.map(r => ({
        Fornecedor: r.fornecedor,
        Produto: r.prod,
        'NF': r.nfO,
        'Data Previsão': r.dataPrevisao,
        'Hora Início': r.horarioPrevisto,
        'Hora Término': r.horarioFim || '',
        Status: r.status,
        Volume: r.qtd,
        'Valor (R$)': r.vUnit,
        Observações: r.observacoes || ''
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Recebimentos");
    XLSX.writeFile(workbook, `Recebimento_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`);
};