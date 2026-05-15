<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js';

// === CONFIGURAÇÃO SUPABASE (variáveis de ambiente) ===
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
=======
// === CONFIGURAÇÃO SUPABASE (variáveis de ambiente) ===
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
=======
    // Verificar se supabase está disponível
    if (typeof supabase === 'undefined') {
        throw new Error('Biblioteca Supabase não foi carregada corretamente');
    }
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
let chartStatus, chartForn, chartVol;
=======
let chartStatus, chartForn;
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e

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

<<<<<<< HEAD
// Fechar sidebar ao clicar fora
document.addEventListener('click', function(e) {
    const sidebar = getElement('sidebar');
    const btnShow = getElement('btnShowSidebar');
    if (!sidebar || sidebar.classList.contains('collapsed')) return;
    if (!sidebar.contains(e.target) && btnShow && !btnShow.contains(e.target)) {
        toggleSidebar();
    }
});

=======
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
    [chartStatus, chartForn, chartVol].forEach(c => { if (c) c.resize(); });
=======
    [chartStatus, chartForn].forEach(c => { if (c) c.resize(); });
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
        showNotification('Erro de Conexão', 'Banco de dados não inicializado. Recarregue a página.', 'fa-exclamation-circle', 'error');
=======
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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

<<<<<<< HEAD
        if (signal.aborted) {
            console.log('ℹ️ Requisição cancelada');
            return;
        }
=======
        if (signal.aborted) return;
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e

        if (error) {
            console.error("❌ Erro ao carregar dados:", error);
            console.error('Detalhes do erro:', {
                mensagem: error.message,
                codigo: error.code,
                status: error.status
            });
<<<<<<< HEAD
            showNotification(
                'Erro ao Carregar Dados',
                `${error.message || 'Erro desconhecido ao carregar dados'}`,
                'fa-exclamation-circle',
                'error'
            );
            return;
        }
        
        console.log(`✅ ${data?.length || 0} registros carregados com sucesso`);
        recebimentos = data || [];
        applyFilters();
    } catch (err) {
        if (err.name === 'AbortError') {
            console.log('ℹ️ Requisição cancelada pelo usuário');
            return;
        }
        console.error("❌ Exceção ao buscar dados:", err);
        showNotification(
            'Erro de Conexão',
            'Erro ao conectar com o banco de dados. Verifique sua conexão.',
            'fa-exclamation-circle',
            'error'
        );
=======
            return;
        }
        
        console.log(`✅ ${data.length} registros carregados com sucesso`);
        recebimentos = data;
        applyFilters();
    } catch (err) {
        if (err.name === 'AbortError') return;
        console.error("❌ Exceção ao buscar dados:", err);
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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

<<<<<<< HEAD
    const fVol = {};
=======
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
    data.forEach(r => {
        tQtd += parseFloat(r.qtd || 0);
        tVal += parseValor(r.vUnit);
        if (r.status === 'Concluído')    fin++;
        else if (r.status === 'Em Descarga') and++;
        else if (r.status === 'Agendado')    agend++;
        fMap[r.fornecedor] = (fMap[r.fornecedor] || 0) + 1;
<<<<<<< HEAD
        fVol[r.fornecedor] = (fVol[r.fornecedor] || 0) + parseFloat(r.qtd || 0);
=======
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
    renderCharts(agend, and, fin, fMap, fVol);
=======
    renderCharts(agend, and, fin, fMap);
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
}

// ─── 4. Resumo Hoje ───────────────────────────────────────────────────
function renderResumoHoje(lista) {
    const container = getElement('containerResumoHoje');
    
    if (!container) {
        console.warn('⚠️ Elemento containerResumoHoje não encontrado');
        return;
    }
    
<<<<<<< HEAD
    if (!lista || lista.length === 0) {
        container.innerHTML = '<div class="col-span-full p-6 bg-slate-100 rounded-xl text-center text-slate-400 text-xs font-bold uppercase border-2 border-dashed border-slate-200">Nenhuma entrega prevista para hoje</div>';
        return;
    }
    
=======
    if (lista.length === 0) {
        container.innerHTML = `<div class="col-span-full p-6 bg-slate-100 rounded-xl text-center text-slate-400 text-xs font-bold uppercase border-2 border-dashed border-slate-200">Nenhuma entrega prevista para hoje</div>`;
        return;
    }
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
    container.innerHTML = lista.map(item => `
        <div class="card-hoje p-4 rounded-xl shadow-sm border border-slate-200">
            <div class="flex justify-between items-start mb-2">
                <span class="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded" style="font-family:Arial,sans-serif;">${item.horarioPrevisto} - ${item.horarioFim || '...'}</span>
                <span class="text-[9px] font-bold uppercase ${item.status === 'Concluído' ? 'text-emerald-500' : 'text-amber-500'}">${item.status}</span>
            </div>
<<<<<<< HEAD
            <h4 class="text-xs font-black text-slate-800 truncate">${item.fornecedor || 'N/A'}</h4>
            <p class="text-[10px] text-slate-500 truncate mb-1">${item.prod || 'N/A'}</p>
=======
            <h4 class="text-xs font-black text-slate-800 truncate">${item.fornecedor}</h4>
            <p class="text-[10px] text-slate-500 truncate mb-1">${item.prod}</p>
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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

<<<<<<< HEAD
    if (!data || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-slate-400 text-xs font-bold uppercase"><i class="fas fa-inbox mr-2"></i>Nenhum registro encontrado para os filtros selecionados.</td></tr>';
        return;
    }

    try {
        tbody.innerHTML = data.map((item) => {
            if (!item || !item.id) return '';
            
            const isAtrasado    = checkAtrasado(item);
        const rowClass      = isAtrasado ? 'row-atrasada' : 'hover:bg-slate-50';
        const statusDisplay = isAtrasado ? `${item.status || 'Agendado'} - ATRASADO` : (item.status || 'Agendado');
=======
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-10 text-center text-slate-400 text-xs font-bold uppercase">Nenhum registro encontrado para os filtros selecionados.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item) => {
        const isAtrasado    = checkAtrasado(item);
        const rowClass      = isAtrasado ? 'row-atrasada' : 'hover:bg-slate-50';
        const statusDisplay = isAtrasado ? `${item.status} - ATRASADO` : item.status;
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
        const statusColor   = isAtrasado
            ? 'bg-red-100 text-red-700'
            : (item.status === 'Concluído'   ? 'bg-green-100 text-green-700' :
               item.status === 'Em Descarga' ? 'bg-blue-100 text-blue-700'  : 'bg-slate-100 text-slate-700');

        const valNumerico = parseValor(item.vUnit);
<<<<<<< HEAD
        const safeFornecedor = (item.fornecedor || 'N/A').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeProd = (item.prod || 'N/A').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeNF = (item.nfO || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeObs = (item.observacoes || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
=======
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e

        return `
            <tr class="${rowClass} transition border-b border-slate-50">
                <td class="px-6 py-4 font-bold text-slate-600">
                    <div class="flex items-center gap-2">
                        ${isAtrasado ? '<i class="fas fa-exclamation-triangle blink-icon" title="Carga Atrasada"></i>' : ''}
<<<<<<< HEAD
                        ${safeFornecedor}
                    </div>
                    ${safeObs ? `<div class="text-[9px] font-normal text-slate-400 mt-1 italic">Obs: ${safeObs}</div>` : ''}
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold text-slate-800">${safeProd}</div>
                    <div class="text-[10px] font-bold text-slate-400" style="font-family:Arial,sans-serif;">NF: ${safeNF}</div>
                </td>
                <td class="px-6 py-4" style="font-family:Arial,sans-serif;">
                    <div class="text-[9px] ${isAtrasado ? 'text-red-600' : 'text-indigo-600'} font-bold uppercase">PREV: ${fmtData(item.dataPrevisao)}</div>
                    <div class="text-[10px] font-black uppercase">DAS ${item.horarioPrevisto || '--:--'} ÀS ${item.horarioFim || '--:--'}</div>
                </td>
                <td class="px-6 py-4 font-bold">${item.qtd || 0} VOL <br> <span class="text-emerald-600 italic">R$ ${valNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></td>
=======
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
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
    } catch (err) {
        console.error('❌ Erro ao renderizar tabela:', err);
        tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-10 text-center text-red-400 text-xs font-bold uppercase">Erro ao renderizar dados</td></tr>';
    }
=======
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
function renderCharts(agend, and, fin, fMap, fVol) {
=======
function renderCharts(agend, and, fin, fMap) {
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD

    if (chartVol) chartVol.destroy();
    const volLabels = Object.keys(fVol || {});
    const chartVolEl = getElement('chartVolumeFornecedor');
    if (!chartVolEl) return;
    if (volLabels.length === 0) {
        const ctx = chartVolEl.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '10px Arial';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'center';
        ctx.fillText('Sem dados para exibir', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    chartVol = new Chart(chartVolEl, {
        type: 'bar',
        data: {
            labels: volLabels,
            datasets: [{
                label: 'Volume Total',
                data: volLabels.map(l => fVol[l]),
                backgroundColor: '#10b981',
                borderRadius: 4
            }]
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 9 } } },
                y: { grid: { display: false }, ticks: { font: { size: 8, weight: 'bold' } } }
            },
            plugins: {
                legend: { display: false },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: '#10b981',
                    font: { weight: 'bold', size: 10, family: 'Arial' },
                    formatter: (value) => value > 0 ? value : ''
                }
            },
            layout: { padding: { top: 20 } }
        }
    });
}

// ─── 9. Filtros ───────────────────────────────────────────────────────
let _filterTimeout = null;
function debounceFilters() {
    if (_filterTimeout) clearTimeout(_filterTimeout);
    _filterTimeout = setTimeout(() => applyFilters(), 300);
}

function applyFilters() {
    try {
        const searchEl = getElement('globalSearch');
        const dateStartEl = getElement('filterDateStart');
        const dateEndEl = getElement('filterDateEnd');
        
        const q = (searchEl?.value || '').toLowerCase().trim();
        const dateStart = dateStartEl?.value || '';
        const dateEnd = dateEndEl?.value || '';
        
        const filtered = recebimentos.filter(r => {
            // Validação rápida do termo de busca com cache
            if (q && q.length > 0) {
                const nf = (r.nfO || "").toLowerCase();
                const fornecedor = (r.fornecedor || "").toLowerCase();
                const prod = (r.prod || "").toLowerCase();
                if (!nf.includes(q) && !fornecedor.includes(q) && !prod.includes(q)) {
                    return false;
                }
            }
            
            // Validação do status com verificação segura
            const matchStatus = (currentStatusFilter === 'Todos' || r.status === currentStatusFilter);
            if (!matchStatus) return false;
            
            // Validação de datas otimizada
            if (dateStart && r.dataPrevisao && r.dataPrevisao < dateStart) return false;
            if (dateEnd && r.dataPrevisao && r.dataPrevisao > dateEnd) return false;
            
            return true;
        }).sort((a, b) => {
            const dateA = a.dataPrevisao || '';
            const dateB = b.dataPrevisao || '';
            return dateB.localeCompare(dateA);
        });
        
        updateUI(filtered);
    } catch (err) {
        console.error('❌ Erro ao aplicar filtros:', err);
    }
=======
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
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
                showNotification('Erro de Conexão', 'Banco de dados não inicializado. Tente recarregar a página.', 'fa-exclamation-circle', 'error');
=======
                console.error('❌ Erro: Banco de dados não inicializado');
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
                return;
            }

            const editIndexEl = getElement('editIndex');
            const dbId = editIndexEl?.value || "";
            
            const obj = {
<<<<<<< HEAD
                fornecedor:      getElement('fornecedor')?.value?.trim() || '',
                prod:            getElement('prod')?.value?.trim() || '',
                nfO:             getElement('nfO')?.value?.trim() || '',
=======
                fornecedor:      getElement('fornecedor')?.value || '',
                prod:            getElement('prod')?.value || '',
                nfO:             getElement('nfO')?.value || '',
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
                dataSolicitacao: getElement('dataSolicitacao')?.value || '',
                dataPrevisao:    getElement('dataPrevisao')?.value || '',
                horarioPrevisto: getElement('horarioPrevisto')?.value || '',
                horarioFim:      getElement('horarioFim')?.value || '',
<<<<<<< HEAD
                qtd:             parseFloat(getElement('qtd')?.value || 0) || 0,
                vUnit:           getElement('vUnit')?.value?.trim() || '',
                status:          getElement('status')?.value || 'Agendado',
                observacoes:     getElement('observacoes')?.value?.trim() || ''
            };

            // Validação básica
            if (!obj.fornecedor || !obj.prod || !obj.nfO) {
                showNotification('Campos Obrigatórios', 'Por favor, preencha Fornecedor, Produto e NF.', 'fa-exclamation-circle', 'warning');
                return;
            }

            if (obj.qtd <= 0) {
                showNotification('Quantidade Inválida', 'A quantidade deve ser maior que zero.', 'fa-exclamation-circle', 'warning');
                return;
            }

=======
                qtd:             getElement('qtd')?.value || '',
                vUnit:           getElement('vUnit')?.value || '',
                status:          getElement('status')?.value || 'Agendado',
                observacoes:     getElement('observacoes')?.value || ''
            };

>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
            try {
                if (dbId === "") {
                    console.log('➕ Inserindo novo registro...');
                    const { data, error } = await supabaseClient.from('recebimentos').insert([obj]);
                    if (error) {
                        console.error("❌ Erro ao salvar:", error);
<<<<<<< HEAD
                        showNotification('Erro ao Salvar', `${error.message}`, 'fa-exclamation-circle', 'error');
                        return;
                    }
                    showNotification('Sucesso', 'Recebimento registrado com sucesso!', 'fa-circle-check', 'success');
=======
                        console.error(`Erro ao salvar:\n${error.message}\n\nDica: Verifique se a tabela 'recebimentos' existe no Supabase`);
                        return;
                    }
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
                    console.log('✅ Registro inserido com sucesso');
                } else {
                    console.log('✏️ Atualizando registro:', dbId);
                    const { error } = await supabaseClient.from('recebimentos').update(obj).eq('id', dbId);
                    if (error) {
                        console.error("❌ Erro ao atualizar:", error);
<<<<<<< HEAD
                        showNotification('Erro ao Atualizar', `${error.message}`, 'fa-exclamation-circle', 'error');
                        return;
                    }
                    showNotification('Sucesso', 'Recebimento atualizado com sucesso!', 'fa-circle-check', 'success');
=======
                        console.error(`Erro ao atualizar:\n${error.message}`);
                        return;
                    }
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
                    console.log('✅ Registro atualizado com sucesso');
                }
                window.closeModal();
                fetchRecebimentos();
            } catch (err) {
                console.error("❌ Exceção ao salvar/atualizar:", err);
<<<<<<< HEAD
                showNotification('Erro', 'Erro ao processar solicitação. Verifique o console.', 'fa-exclamation-circle', 'error');
=======
                console.error('Erro ao processar solicitação. Verifique o console.');
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
        globalSearch.addEventListener('input', debounceFilters);
=======
        globalSearch.addEventListener('input', applyFilters);
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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
<<<<<<< HEAD
                showNotification('Erro de Conexão', 'Banco de dados não inicializado. Tente recarregar a página.', 'fa-exclamation-circle', 'error');
=======
                console.error('❌ Erro: Banco de dados não inicializado');
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
                return;
            }

            const id = _pendingDeleteId;
            closeDeleteModal();
            
            try {
                console.log('🗑️ Deletando registro:', id);
                const { error } = await supabaseClient.from('recebimentos').delete().eq('id', id);
                if (error) {
                    console.error("❌ Erro ao excluir:", error);
<<<<<<< HEAD
                    showNotification('Erro ao Excluir', `${error.message}`, 'fa-exclamation-circle', 'error');
                    return;
                }
                showNotification('Sucesso', 'Registro excluído com sucesso!', 'fa-circle-check', 'success');
=======
                    console.error(`Erro ao excluir:\n${error.message}`);
                    return;
                }
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
                console.log('✅ Registro deletado com sucesso');
                fetchRecebimentos();
            } catch (err) {
                console.error("❌ Exceção ao deletar:", err);
<<<<<<< HEAD
                showNotification('Erro', 'Erro ao deletar registro. Verifique o console.', 'fa-exclamation-circle', 'error');
=======
                console.error('Erro ao deletar. Verifique o console.');
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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

<<<<<<< HEAD
    // Filtro padrão: últimos 15 dias
    const hoje = new Date();
    const quinzeDiasAtras = new Date(hoje);
    quinzeDiasAtras.setDate(hoje.getDate() - 15);
    const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (filterDateStart) filterDateStart.value = fmt(quinzeDiasAtras);
    if (filterDateEnd) filterDateEnd.value = fmt(hoje);

    // Enter no campo de busca NF usa a pasta salva
    const nfInput = getElement('nfSearchInput');
    if (nfInput) {
        nfInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchNFOnComputer();
        });
    }

=======
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
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

<<<<<<< HEAD
window.closeDeleteModal = function() {
=======
function closeDeleteModal() {
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
    _pendingDeleteId = null;
    const modal = getElement('deleteConfirmModal');
    if (!modal) return;
    modal.classList.remove('active');
<<<<<<< HEAD
};
=======
}
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e

window.deleteRecusa = function(id) {
    openDeleteModal(id);
};

// ─── 12. Exportar Excel ───────────────────────────────────────────────
window.exportFilteredExcel = function() {
    const searchEl = getElement('globalSearch');
    const dateStartEl = getElement('filterDateStart');
    const dateEndEl = getElement('filterDateEnd');
    
<<<<<<< HEAD
    const q = (searchEl?.value || '').toLowerCase().trim();
=======
    const q = (searchEl?.value || '').toLowerCase();
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
    const dateStart = dateStartEl?.value || '';
    const dateEnd = dateEndEl?.value || '';
    
    const filtered  = recebimentos.filter(r => {
<<<<<<< HEAD
        if (q) {
            const nf = (r.nfO || "").toLowerCase();
            const fornecedor = (r.fornecedor || "").toLowerCase();
            const prod = (r.prod || "").toLowerCase();
            if (!nf.includes(q) && !fornecedor.includes(q) && !prod.includes(q)) {
                return false;
            }
        }
        
        const matchStatus = (currentStatusFilter === 'Todos' || r.status === currentStatusFilter);
        if (!matchStatus) return false;
        
        if (dateStart && r.dataPrevisao < dateStart) return false;
        if (dateEnd && r.dataPrevisao > dateEnd) return false;
        
        return true;
    }).sort((a, b) => (b.dataPrevisao || '').localeCompare(a.dataPrevisao || ''));

    if (filtered.length === 0) {
        showNotification('Nenhum Dado para Exportar', 'Não há registros para os filtros selecionados.', 'fa-info-circle', 'info');
        return;
    }
    
    const exportData = filtered.map(r => ({
        Fornecedor: r.fornecedor || '',
        Produto: r.prod || '',
        'NF': r.nfO || '',
        'Data Previsão': r.dataPrevisao || '',
        'Hora Início': r.horarioPrevisto || '',
        'Hora Término': r.horarioFim || '',
        Status: r.status || '',
        Volume: r.qtd || 0,
        'Valor (R$)': r.vUnit || '',
        Observações: r.observacoes || ''
    }));
    
    try {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook  = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Recebimentos");
        XLSX.writeFile(workbook, `Recebimento_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.xlsx`);
        showNotification('Sucesso', `${filtered.length} registros exportados com sucesso!`, 'fa-circle-check', 'success');
    } catch (err) {
        console.error('Erro ao exportar Excel:', err);
        showNotification('Erro ao Exportar', `${err.message}`, 'fa-exclamation-circle', 'error');
    }
};

// ─── IndexedDB ─────────────────────────────────────────────────────────
const DB_NAME = 'NFSearchDB';
const DB_STORE = 'handles';
const DB_KEY = 'lastFolder';

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = e => e.target.result.createObjectStore(DB_STORE);
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => reject(e.target.error);
    });
}

async function dbSaveHandle(handle) {
    const db = await openDB();
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(handle, DB_KEY);
    return new Promise((resolve, reject) => {
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = e => { db.close(); reject(e.target.error); };
    });
}

async function dbLoadHandle() {
    try {
        const db = await openDB();
        const tx = db.transaction(DB_STORE, 'readonly');
        const req = tx.objectStore(DB_STORE).get(DB_KEY);
        return new Promise((resolve, reject) => {
            req.onsuccess = () => { db.close(); resolve(req.result); };
            req.onerror = e => { db.close(); reject(e.target.error); };
        });
    } catch {
        return null;
    }
}

// ─── Notification Modal ──────────────────────────────────────────────
window.showNotification = function(title, message, icon = 'exclamation-circle', type = 'warning') {
    const overlay = getElement('notificationModal');
    const titleEl = getElement('notificationTitle');
    const messageEl = getElement('notificationMessage');
    const iconContainer = getElement('notificationIcon');
    const button = getElement('notificationButton');
    
    if (!overlay) return;
    
    const colorMap = {
        'success': { bg: 'bg-emerald-50', icon: 'fa-circle-check', color: 'text-emerald-500', button: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' },
        'error': { bg: 'bg-red-50', icon: 'fa-circle-xmark', color: 'text-red-500', button: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' },
        'info': { bg: 'bg-blue-50', icon: 'fa-info-circle', color: 'text-blue-500', button: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' },
        'warning': { bg: 'bg-amber-50', icon: 'fa-exclamation-circle', color: 'text-amber-500', button: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700' }
    };
    
    const theme = colorMap[type] || colorMap['warning'];
    
    if (titleEl) titleEl.innerText = title;
    if (messageEl) messageEl.innerText = message;
    
    iconContainer.className = `notification-icon-container ${theme.bg} px-6 py-6 flex justify-center items-center`;
    const iconEl = iconContainer.querySelector('i');
    if (iconEl) iconEl.className = `fas ${theme.icon} ${theme.color} text-4xl`;
    
    if (button) {
        button.className = `w-full bg-gradient-to-r ${theme.button} text-white font-bold py-3 rounded-xl transition shadow-lg uppercase text-sm`;
    }
    
    overlay.classList.add('active');
};

window.closeNotificationModal = function() {
    const overlay = getElement('notificationModal');
    if (!overlay) return;
    overlay.classList.remove('active');
};

// ─── 13. Busca NF-e ────────────────────────────────────────────────────
let _nfDataCache = null;
let _nfFileHandles = [];

window.openNFSearchModal = async function() {
    _nfDataCache = null;
    _nfFileHandles = [];
    const modal = getElement('nfSearchModal');
    const result = getElement('nfSearchResult');
    const fileList = getElement('nfFileList');
    const loading = getElement('nfSearchLoading');
    const input = getElement('nfSearchInput');
    if (modal) modal.classList.add('active');
    if (result) result.classList.add('hidden');
    if (fileList) fileList.classList.add('hidden');
    if (loading) loading.classList.add('hidden');
    if (input) input.value = '';

    // Tenta usar pasta salva automaticamente
    const savedHandle = await dbLoadHandle();
    if (savedHandle && typeof savedHandle.queryPermission === 'function') {
        try {
            const perm = await savedHandle.queryPermission({ mode: 'read' });
            if (perm === 'granted') {
                input.placeholder = 'Digite o número e pressione Enter...';
                input._savedHandle = savedHandle;
            } else if (perm === 'prompt') {
                const granted = await savedHandle.requestPermission({ mode: 'read' });
                if (granted === 'granted') {
                    input.placeholder = 'Digite o número e pressione Enter...';
                    input._savedHandle = savedHandle;
                }
            }
        } catch {}
    }
};

window.closeNFSearchModal = function() {
    const modal = getElement('nfSearchModal');
    if (modal) modal.classList.remove('active');
};

window.selectSearchFolder = async function() {
    if (!window.showDirectoryPicker) {
        showNotification(
            'Navegador Não Suportado',
            'Seu navegador não suporta esta funcionalidade. Por favor, use Chrome ou Edge atualizado.',
            'fa-browser',
            'error'
        );
        return;
    }
    try {
        const dirHandle = await window.showDirectoryPicker({ startIn: 'downloads', mode: 'read' });
        const input = getElement('nfSearchInput');
        if (input) input._savedHandle = dirHandle;
        await dbSaveHandle(dirHandle);
        if (input) {
            input.placeholder = 'Pasta salva! Digite o número e pressione Enter...';
            showNotification(
                'Pasta Salva com Sucesso',
                'A pasta foi salva e será usada automaticamente nas próximas buscas.',
                'fa-check-circle',
                'success'
            );
        }
    } catch (err) {
        if (err.name === 'AbortError' || err.name === 'SecurityError') return;
        console.error('Erro ao selecionar pasta:', err);
        showNotification(
            'Erro ao Selecionar Pasta',
            `Ocorreu um erro: ${err.message}`,
            'fa-exclamation-circle',
            'error'
        );
    }
};

async function doSearch(searchTerm, dirHandle) {
    const result = getElement('nfSearchResult');
    const fileList = getElement('nfFileList');
    const loading = getElement('nfSearchLoading');

    try {
        if (result) result.classList.add('hidden');
        if (fileList) fileList.classList.add('hidden');
        if (loading) loading.classList.remove('hidden');

        await new Promise(r => setTimeout(r, 50));

        _nfFileHandles = [];
        await scanDirForXML(dirHandle, searchTerm, _nfFileHandles);

        if (loading) loading.classList.add('hidden');

        if (_nfFileHandles.length === 1) {
            console.log('✅ Um arquivo encontrado, processando automaticamente');
            parseSelectedNF(0);
        } else if (_nfFileHandles.length > 1 && fileList) {
            const container = getElement('nfFileListItems');
            if (container) {
                container.innerHTML = _nfFileHandles.map((f, i) => {
                    const before = f.name.slice(0, f.matchIdx);
                    const match = f.name.slice(f.matchIdx, f.matchIdx + searchTerm.length);
                    const after = f.name.slice(f.matchIdx + searchTerm.length);
                    return `<button onclick="parseSelectedNF(${i})" class="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 transition border border-slate-200 text-xs font-mono truncate hover:shadow-md">
                        ${escapeHtml(before)}<span class="bg-yellow-200 text-slate-900 font-bold px-0.5 rounded">${escapeHtml(match)}</span>${escapeHtml(after)}
                    </button>`;
                }).join('');
            }
            fileList.classList.remove('hidden');
            console.log(`✅ ${_nfFileHandles.length} arquivos encontrados`);
        } else {
            console.warn(`⚠️ Nenhum arquivo encontrado para: ${searchTerm}`);
            showNotification(
                'Nenhum Resultado',
                `Nenhum arquivo XML com "${searchTerm}" foi encontrado. Verifique a pasta ou tente outro número.`,
                'fa-search',
                'info'
            );
        }
    } catch (err) {
        if (loading) loading.classList.add('hidden');
        console.error('❌ Erro ao processar busca:', err);
        showNotification(
            'Erro na Busca',
            `${err.message || 'Erro desconhecido ao processar busca'}`,
            'fa-exclamation-circle',
            'error'
        );
    }
}

window.searchNFOnComputer = async function() {
    const input = getElement('nfSearchInput');
    const searchTerm = input?.value.trim();
    
    // Validação otimizada de campo vazio
    if (!searchTerm || searchTerm.length === 0) {
        showNotification(
            'Campo Obrigatório',
            'Digite o número da NF-e (exemplo: 312604) para buscar os arquivos XML.',
            'fa-exclamation-circle',
            'warning'
        );
        input?.focus();
        input?.classList.add('animate-pulse', 'border-red-400', 'border-2');
        setTimeout(() => input?.classList.remove('animate-pulse', 'border-red-400', 'border-2'), 2000);
        return;
    }
    
    // Validação de comprimento mínimo
    if (searchTerm.length < 2) {
        showNotification(
            'Número Inválido',
            'Digite pelo menos 2 caracteres do número da NF-e.',
            'fa-info-circle',
            'info'
        );
        input?.focus();
        return;
    }

    // Usar pasta salva se disponível
    if (input && input._savedHandle) {
        await doSearch(searchTerm, input._savedHandle);
        return;
    }

    const loading = getElement('nfSearchLoading');
    try {
        let dirHandle;
        let isRealHandle = false;
        try {
            if (!window.showDirectoryPicker) throw new Error('API não disponível');
            dirHandle = await window.showDirectoryPicker({ startIn: 'downloads', mode: 'read' });
            isRealHandle = true;
        } catch (pickerErr) {
            if (pickerErr.name === 'AbortError' || pickerErr.name === 'SecurityError') return;
            const fallback = await pickFolderFallback();
            if (!fallback) {
                if (loading) loading.classList.add('hidden');
                return;
            }
            dirHandle = fallback;
        }

        // Salva o handle real no IndexedDB com tratamento de erro melhorado
        if (isRealHandle) {
            try { 
                await dbSaveHandle(dirHandle);
                console.log('✅ Pasta salva no IndexedDB');
            } catch (saveErr) {
                console.warn('⚠️ Não foi possível salvar pasta:', saveErr.message);
            }
        }

        await doSearch(searchTerm, dirHandle);
    } catch (err) {
        if (loading) loading.classList.add('hidden');
        if (err.name === 'AbortError' || err.name === 'SecurityError') return;
        console.error('❌ Erro ao buscar NF:', err);
        showNotification(
            'Erro ao Buscar NF-e',
            `${err.message || 'Ocorreu um erro desconhecido'}. Tente novamente.`,
            'fa-exclamation-circle',
            'error'
        );
    }
};

async function scanDirForXML(dirHandle, searchTerm, results) {
    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'directory') {
            try { await scanDirForXML(entry, searchTerm, results); } catch (_) {}
        } else if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.xml')) {
            const name = entry.name;
            if (name.toLowerCase().includes(searchTerm.toLowerCase())) {
                results.push({ handle: entry, name, matchIdx: name.toLowerCase().indexOf(searchTerm.toLowerCase()) });
            }
        }
    }
}

function pickFolderFallback() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;

        input.addEventListener('change', function() {
            document.body.removeChild(this);
            const files = this.files;
            if (!files || files.length === 0) {
                reject(new Error('Nenhum arquivo selecionado'));
                return;
            }
            const entries = [];
            const seen = new Set();
            for (const f of files) {
                const name = f.name;
                if (!name.toLowerCase().endsWith('.xml')) continue;
                if (!seen.has(name)) {
                    seen.add(name);
                    entries.push({ kind: 'file', name, getFile: () => f });
                }
            }
            resolve({
                kind: 'directory',
                name: 'pasta',
                values() {
                    return {
                        [Symbol.asyncIterator]() {
                            let i = 0;
                            return {
                                next: () => i < entries.length
                                    ? Promise.resolve({ value: entries[i++], done: false })
                                    : Promise.resolve({ done: true })
                            };
                        }
                    };
                }
            });
        });

        input.style.display = 'none';
        document.body.appendChild(input);
        input.addEventListener('cancel', () => {
            document.body.removeChild(input);
            reject(new DOMException('Cancelado', 'AbortError'));
        });
        input.click();
    });
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.parseSelectedNF = async function(index) {
    const entry = _nfFileHandles[index];
    if (!entry) {
        console.warn('⚠️ Arquivo não encontrado no índice:', index);
        return;
    }

    try {
        const file = await entry.handle.getFile();
        const text = await file.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        // Verificar se o XML foi parseado corretamente
        if (xmlDoc.documentElement.nodeName === 'parsererror') {
            throw new Error('Arquivo XML inválido ou corrompido');
        }

        // Extrair dados com validações seguras
        const emit = xmlDoc.getElementsByTagName('emit')[0];
        const fornecedor = emit?.getElementsByTagName('xNome')[0]?.textContent?.trim() || 'N/A';
        const cnpj = emit?.getElementsByTagName('CNPJ')[0]?.textContent?.trim() || 'N/A';

        const vol = xmlDoc.getElementsByTagName('vol')[0];
        const volume = vol?.getElementsByTagName('qVol')[0]?.textContent?.trim() || '0';

        const detPag = xmlDoc.getElementsByTagName('detPag')[0];
        const valor = detPag?.getElementsByTagName('vPag')[0]?.textContent?.trim() || '0';

        const nNF = xmlDoc.getElementsByTagName('nNF')[0]?.textContent?.trim() || 'N/A';

        _nfDataCache = { fornecedor, cnpj, volume, valor, nfO: nNF };

        const result = getElement('nfSearchResult');
        const dataEl = getElement('nfResultData');
        if (dataEl) {
            const valorFormatado = parseFloat(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            dataEl.innerHTML = `
                <div><span class="font-bold text-slate-600 min-w-20 inline-block">NF:</span> <span class="text-emerald-700 font-semibold">${escapeHtml(nNF)}</span></div>
                <div><span class="font-bold text-slate-600 min-w-20 inline-block">Fornecedor:</span> <span class="text-slate-700">${escapeHtml(fornecedor)}</span></div>
                <div><span class="font-bold text-slate-600 min-w-20 inline-block">CNPJ:</span> <span class="text-slate-700 font-mono">${escapeHtml(cnpj)}</span></div>
                <div><span class="font-bold text-slate-600 min-w-20 inline-block">Volume:</span> <span class="text-slate-700 font-semibold">${escapeHtml(volume)} unid.</span></div>
                <div><span class="font-bold text-slate-600 min-w-20 inline-block">Valor:</span> <span class="text-emerald-600 font-bold">R$ ${valorFormatado}</span></div>
            `;
        }
        if (result) result.classList.remove('hidden');
        console.log('✅ Dados extraídos com sucesso:', _nfDataCache);
    } catch (err) {
        console.error('❌ Erro ao ler arquivo:', err);
        showNotification(
            'Erro ao Processar XML',
            `${err.message || 'Erro desconhecido ao processar arquivo'}. Verifique se é um arquivo XML válido.`,
            'fa-exclamation-circle',
            'error'
        );
    }
};

window.useNFData = function() {
    if (!_nfDataCache) {
        showNotification('Erro', 'Nenhum dados de NF carregado.', 'fa-exclamation-circle', 'error');
        return;
    }

    try {
        const fEl = getElement('fornecedor');
        const nfEl = getElement('nfO');
        const qtdEl = getElement('qtd');
        const vEl = getElement('vUnit');
        const titleEl = getElement('modalTitle');
        const editIdx = getElement('editIndex');

        if (fEl) fEl.value = _nfDataCache.fornecedor;
        if (nfEl) nfEl.value = _nfDataCache.nfO;
        if (qtdEl) qtdEl.value = _nfDataCache.volume || 0;
        if (vEl) {
            vEl.value = _nfDataCache.valor || '0';
            formatarMoeda(vEl);
        }
        if (titleEl) titleEl.innerText = 'Novo Recebimento (via NF-e)';
        if (editIdx) editIdx.value = '';

        console.log('✅ Dados de NF-e preenchidos no formulário');
        closeNFSearchModal();
        window.openModal();
        
        showNotification('Sucesso', 'Dados da NF-e foram preenchidos automaticamente!', 'fa-check-circle', 'success');
    } catch (err) {
        console.error('❌ Erro ao usar dados de NF:', err);
        showNotification('Erro', 'Erro ao preencher formulário com dados de NF.', 'fa-exclamation-circle', 'error');
    }
=======
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
>>>>>>> 2a11fc2cd97cf795d140c1ba248db9a88531b33e
};