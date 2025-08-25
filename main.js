document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o usuário padrão se não existir
    if (!localStorage.getItem('usuarios')) {
        const defaultUser = {
            id: Date.now().toString(),
            nome: "Usuário Teste",
            email: "teste@nutri.com",
            senha: "Teste@123",
            fisico: {},
            exercicios: [],
            cardapio: [],
            historico: []
        };
        localStorage.setItem('usuarios', JSON.stringify([defaultUser]));
    }

    const app = document.getElementById('app');
    let currentUser = null;

    // Rotas da aplicação
    const routes = {
        login: renderLoginScreen,
        register: renderRegisterScreen,
        main: renderMainScreen,
        physicalData: renderPhysicalDataScreen,
        exercises: renderExercisesScreen,
        menu: renderMenuScreen,
        performance: renderPerformanceScreen
    };

    // Inicializa com a tela de login
    navigateTo('login');

    // Função para navegar entre telas
    function navigateTo(route) {
        routes[route]();
    }

    function renderLoginScreen() {
        app.innerHTML = `
            <div class="screen">
                <h1>Bem-vindo ao NutriFit</h1>
                <div class="form-group">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" placeholder="Digite seu e-mail">
                </div>
                <div class="form-group">
                    <label for="password">Senha</label>
                    <input type="password" id="password" placeholder="Digite sua senha">
                </div>
                <button id="loginBtn" class="btn btn-block">Entrar</button>
                <p style="text-align: center; margin-top: 15px;">
                    Não tem conta? <a href="#" id="registerLink">Cadastre-se</a>
                </p>
            </div>
        `;

        document.getElementById('loginBtn').addEventListener('click', () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            loginUser(email, password);
        });

        document.getElementById('registerLink').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('register');
        });
    }

    function renderRegisterScreen() {
        app.innerHTML = `
            <div class="screen">
                <h1>Criar Conta</h1>
                <div class="form-group">
                    <label for="regName">Nome Completo</label>
                    <input type="text" id="regName" placeholder="Seu nome completo">
                </div>
                <div class="form-group">
                    <label for="regEmail">E-mail</label>
                    <input type="email" id="regEmail" placeholder="Seu melhor e-mail">
                </div>
                <div class="form-group">
                    <label for="regPassword">Senha</label>
                    <input type="password" id="regPassword" placeholder="Crie uma senha segura">
                </div>
                <button id="registerBtn" class="btn btn-block">Cadastrar</button>
                <p style="text-align: center; margin-top: 15px;">
                    Já tem conta? <a href="#" id="loginLink">Fazer login</a>
                </p>
            </div>
        `;

        document.getElementById('registerBtn').addEventListener('click', registerUser);
        document.getElementById('loginLink').addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo('login');
        });
    }

    function renderMainScreen() {
        app.innerHTML = `
            <div class="screen">
                <h1>Olá, ${currentUser.nome.split(' ')[0]}!</h1>
                <p style="margin-bottom: 20px;">Seja bem-vindo ao seu acompanhamento nutricional e de exercícios.</p>
                
                <div class="btn-group">
                    <button id="physicalDataBtn" class="btn btn-block">Cadastrar Dados Físicos</button>
                    ${currentUser.fisico.pesoAtual ? 
                        `<button id="exercisesBtn" class="btn btn-block">Selecionar Exercícios</button>` : ''}
                    ${currentUser.exercicios.length > 0 ? 
                        `<button id="menuBtn" class="btn btn-block">Ver Cardápio</button>` : ''}
                    ${currentUser.fisico.pesoAtual && currentUser.exercicios.length > 0 ? 
                        `<button id="performanceBtn" class="btn btn-block">Ver Desempenho</button>` : ''}
                </div>
                
                <button id="logoutBtn" class="btn btn-block" style="margin-top: 30px; background: var(--danger);">Sair</button>
            </div>
        `;

        document.getElementById('physicalDataBtn').addEventListener('click', () => navigateTo('physicalData'));
        if (document.getElementById('exercisesBtn')) {
            document.getElementById('exercisesBtn').addEventListener('click', () => navigateTo('exercises'));
        }
        if (document.getElementById('menuBtn')) {
            document.getElementById('menuBtn').addEventListener('click', () => navigateTo('menu'));
        }
        if (document.getElementById('performanceBtn')) {
            document.getElementById('performanceBtn').addEventListener('click', () => navigateTo('performance'));
        }
        document.getElementById('logoutBtn').addEventListener('click', logout);
    }

    function renderPhysicalDataScreen() {
        app.innerHTML = `
            <div class="screen physical-data-screen">
                <h1>Seus Dados Físicos</h1>
                <div class="form-row">
                    <div class="form-group">
                        <label for="weight">Peso Atual (kg)</label>
                        <input type="number" id="weight" value="${currentUser.fisico.pesoAtual || ''}">
                    </div>
                    <div class="form-group">
                        <label for="height">Altura (cm)</label>
                        <input type="number" id="height" value="${currentUser.fisico.altura || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="desiredWeight">Peso Desejado (kg)</label>
                    <input type="number" id="desiredWeight" value="${currentUser.fisico.pesoDesejado || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="workStart">Início do Trabalho</label>
                        <input type="time" id="workStart" value="${currentUser.fisico.horarioTrabalho?.inicio || '08:00'}">
                    </div>
                    <div class="form-group">
                        <label for="workEnd">Fim do Trabalho</label>
                        <input type="time" id="workEnd" value="${currentUser.fisico.horarioTrabalho?.fim || '17:00'}">
                    </div>
                </div>
                <button id="savePhysicalDataBtn" class="btn btn-block">Salvar Dados</button>
                <button id="backBtn" class="btn btn-block" style="background: var(--danger); margin-top: 10px;">Voltar</button>
            </div>
        `;

        document.getElementById('savePhysicalDataBtn').addEventListener('click', savePhysicalData);
        document.getElementById('backBtn').addEventListener('click', () => navigateTo('main'));
    }

    function renderExercisesScreen() {
        const exercises = [
            "Academia", "Natação", "Bicicleta", 
            "Corrida", "Caminhada", "Dança"
        ];

        app.innerHTML = `
            <div class="screen">
                <h1>Selecione Seus Exercícios</h1>
                <p>Escolha até 3 exercícios para incluir no seu plano:</p>
                
                <div id="exercisesContainer" style="margin: 20px 0;">
                    ${exercises.map(ex => `
                        <div class="exercise-card ${currentUser.exercicios.includes(ex) ? 'selected' : ''}" data-exercise="${ex}">
                            <h3>${ex}</h3>
                        </div>
                    `).join('')}
                </div>
                
                <button id="saveExercisesBtn" class="btn btn-block" ${currentUser.exercicios.length === 0 ? 'disabled' : ''}>Salvar Exercícios</button>
                <button id="backBtn" class="btn btn-block" style="background: var(--danger); margin-top: 10px;">Voltar</button>
            </div>
        `;

        document.querySelectorAll('.exercise-card').forEach(card => {
            card.addEventListener('click', function() {
                const exercise = this.dataset.exercise;
                const index = currentUser.exercicios.indexOf(exercise);
                
                if (index === -1) {
                    if (currentUser.exercicios.length < 3) {
                        currentUser.exercicios.push(exercise);
                        this.classList.add('selected');
                    }
                } else {
                    currentUser.exercicios.splice(index, 1);
                    this.classList.remove('selected');
                }
                
                document.getElementById('saveExercisesBtn').disabled = currentUser.exercicios.length === 0;
            });
        });

        document.getElementById('saveExercisesBtn').addEventListener('click', saveExercises);
        document.getElementById('backBtn').addEventListener('click', () => navigateTo('main'));
    }

    function renderMenuScreen() {
        const suggestedMenus = {
            light: [
                "Café da manhã: Omelete com espinafre + pão integral",
                "Lanche: Iogurte natural com granola sem açúcar",
                "Almoço: Peito de frango grelhado + arroz integral + brócolis",
                "Lanche da tarde: Mix de castanhas",
                "Jantar: Salmão + quinoa + salada verde"
            ],
            medium: [
                "Café da manhã: Aveia com banana e canela",
                "Lanche: Fatia de queijo branco com torrada integral",
                "Almoço: Carne magra + batata-doce + legumes",
                "Lanche da tarde: Smoothie de frutas",
                "Jantar: Omelete de claras com cogumelos"
            ],
            intense: [
                "Café da manhã: Whey protein com banana e aveia",
                "Lanche: Pasta de amendoim com maçã",
                "Almoço: Filé de peixe + arroz integral + feijão + salada",
                "Lanche da tarde: Ovos cozidos",
                "Jantar: Frango + batata-doce + vegetais"
            ]
        };

        // Determina o cardápio baseado nos exercícios escolhidos
        let activeLevel = 'light';
        if (currentUser.exercicios.length >= 2) activeLevel = 'medium';
        if (currentUser.exercicios.includes('Academia') && currentUser.exercicios.includes('Corrida')) {
            activeLevel = 'intense';
        }

        app.innerHTML = `
            <div class="screen">
                <h1>Seu Cardápio Personalizado</h1>
                <p style="margin-bottom: 20px;">Baseado nos seus exercícios e objetivos:</p>
                
                <div class="menu-plan">
                    <h3>Plano ${activeLevel === 'intense' ? 'Intenso' : activeLevel === 'medium' ? 'Moderado' : 'Leve'}</h3>
                    <ul style="margin: 15px 0 20px 20px;">
                        ${suggestedMenus[activeLevel].map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
                    </ul>
                </div>
                
                <button id="backBtn" class="btn btn-block">Voltar</button>
            </div>
        `;

        document.getElementById('backBtn').addEventListener('click', () => navigateTo('main'));
    }

    function renderPerformanceScreen() {
        const weightDiff = currentUser.fisico.pesoAtual - currentUser.fisico.pesoDesejado;
        const weeksToGoal = Math.max(0, Math.ceil(weightDiff / 0.5));
        const waterPerDay = (currentUser.fisico.pesoAtual * 0.035).toFixed(1);
        
        app.innerHTML = `
            <div class="screen performance-screen">
                <h1>Seu Desempenho</h1>
                
                <div class="performance-card">
                    <h3>Progresso</h3>
                    <p>Tempo estimado para meta: ${weeksToGoal} semanas</p>
                    <div style="height: 10px; background: #f0f0f0; border-radius: 5px; margin-top: 10px;">
                        <div style="height: 100%; width: ${100 - (weightDiff / (currentUser.fisico.pesoAtual - currentUser.fisico.pesoDesajado) * 100)}%; background: var(--primary); border-radius: 5px;"></div>
                    </div>
                </div>
                
                <div class="performance-card">
                    <h3>Hidratação</h3>
                    <p>Água recomendada: ${waterPerDay} litros/dia</p>
                    <button id="waterReminderBtn" class="btn" style="margin-top: 10px;">Configurar Lembrete</button>
                </div>
                
                <div class="performance-card">
                    <h3>Seus Exercícios</h3>
                    <ul>
                        ${currentUser.exercicios.map(ex => `<li style="margin-bottom: 5px;">${ex}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="performance-card">
                    <h3>Sugestões</h3>
                    ${weightDiff > 0 ? `<p>Você está perdendo em média 0.5kg por semana.</p>` : `<p>Você atingiu sua meta de peso! Mantenha seus exercícios.</p>`}
                    <p>Siga o cardápio sugerido para melhores resultados.</p>
                </div>
                
                <button id="backBtn" class="btn btn-block">Voltar</button>
            </div>
        `;

        document.getElementById('waterReminderBtn').addEventListener('click', setupWaterReminder);
        document.getElementById('backBtn').addEventListener('click', () => navigateTo('main'));
    }

    // Funções de manipulação de dados
    function loginUser(email, password) {
        const users = JSON.parse(localStorage.getItem('usuarios'));
        const user = users.find(u => u.email === email && u.senha === password);
        
        if (user) {
            currentUser = user;
            navigateTo('main');
        } else {
            alert('Credenciais inválidas');
        }
    }

    function registerUser() {
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        
        if (!name || !email || !password) {
            alert('Preencha todos os campos');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('usuarios')) || [];
        if (users.some(u => u.email === email)) {
            alert('E-mail já cadastrado');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            nome: name,
            email: email,
            senha: password,
            fisico: {},
            exercicios: [],
            cardapio: [],
            historico: []
        };
        
        users.push(newUser);
        localStorage.setItem('usuarios', JSON.stringify(users));
        alert('Cadastro realizado com sucesso!');
        navigateTo('login');
    }

    function savePhysicalData() {
        currentUser.fisico = {
            pesoAtual: parseFloat(document.getElementById('weight').value),
            altura: parseFloat(document.getElementById('height').value),
            pesoDesejado: parseFloat(document.getElementById('desiredWeight').value),
            horarioTrabalho: {
                inicio: document.getElementById('workStart').value,
                fim: document.getElementById('workEnd').value
            }
        };
        
        updateUser(currentUser);
        navigateTo('main');
    }

    function saveExercises() {
        updateUser(currentUser);
        navigateTo('main');
    }

    function updateUser(userData) {
        const users = JSON.parse(localStorage.getItem('usuarios'));
        const updatedUsers = users.map(u => 
            u.id === userData.id ? userData : u
        );
        localStorage.setItem('usuarios', JSON.stringify(updatedUsers));
    }

    function logout() {
        currentUser = null;
        navigateTo('login');
    }

    function setupWaterReminder() {
        alert('Lembrete de água configurado para 2 horas (120 minutos). Para teste você pode ajustar para 1 minuto.');
        const intervalMinutes = confirm('Para testes, deseja configurar para 1 minuto?') ? 1 : 120;
        
        setInterval(() => {
            alert('Lembrete: está na hora de beber água!');
        }, intervalMinutes * 60 * 1000);
    }
});



