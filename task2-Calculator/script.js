document.addEventListener('DOMContentLoaded', function() {
 
    const calculator = {
        currentOperand: '0',
        previousOperand: '',
        operation: undefined,
        memory: 0,
        waitingForNewOperand: false,
        history: []
    };

    const currentOperandElement = document.getElementById('currentOperand');
    const previousOperandElement = document.getElementById('previousOperand');
    const operationDisplayElement = document.getElementById('operationDisplay');
    const historyListElement = document.getElementById('historyList');
    const viewCodeButton = document.getElementById('viewCode');
    const testKeyboardButton = document.getElementById('testKeyboard');
    const themeButtons = document.querySelectorAll('.theme-option');

  
    function initCalculator() {
        updateDisplay();
        setupEventListeners();
        setupKeyboardSupport();
        loadFromLocalStorage();
    }

    function updateDisplay() {
        currentOperandElement.textContent = formatDisplayNumber(calculator.currentOperand);
        previousOperandElement.textContent = calculator.previousOperand;
        operationDisplayElement.textContent = calculator.operation || '';
        
       
        currentOperandElement.style.animation = 'none';
        setTimeout(() => {
            currentOperandElement.style.animation = 'pulse 0.3s';
        }, 10);
    }

    function formatDisplayNumber(number) {
        const stringNumber = number.toString();
      
        if (stringNumber.includes('.')) {
            const [integerPart, decimalPart] = stringNumber.split('.');
            return `${parseFloat(integerPart).toLocaleString()}.${decimalPart}`;
        }
        
        if (stringNumber.length > 10) {
            return parseFloat(number).toExponential(5);
        }
        
        return parseFloat(number).toLocaleString();
    }

    
    function appendNumber(number) {
        if (calculator.waitingForNewOperand) {
            calculator.currentOperand = number;
            calculator.waitingForNewOperand = false;
        } else {
            calculator.currentOperand = calculator.currentOperand === '0' ? number : calculator.currentOperand + number;
        }
        updateDisplay();
    }

 
    function appendDecimal() {
        if (calculator.waitingForNewOperand) {
            calculator.currentOperand = '0.';
            calculator.waitingForNewOperand = false;
        } else if (!calculator.currentOperand.includes('.')) {
            calculator.currentOperand += '.';
        }
        updateDisplay();
    }

   
    function chooseOperation(op) {
        if (calculator.currentOperand === '') return;
        
        if (calculator.previousOperand !== '') {
            compute();
        }
        
        calculator.operation = op;
        calculator.previousOperand = calculator.currentOperand;
        calculator.waitingForNewOperand = true;
        updateDisplay();
    }

   
    function compute() {
        let computation;
        const prev = parseFloat(calculator.previousOperand);
        const current = parseFloat(calculator.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (calculator.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Error: Cannot divide by zero!');
                    clearCalculator();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
      
        const historyItem = {
            expression: `${prev} ${calculator.operation} ${current}`,
            result: computation,
            timestamp: new Date().toLocaleTimeString()
        };
        
        calculator.history.unshift(historyItem);
        if (calculator.history.length > 5) calculator.history.pop();
        updateHistoryDisplay();
        saveToLocalStorage();
        
        calculator.currentOperand = computation.toString();
        calculator.operation = undefined;
        calculator.previousOperand = '';
        calculator.waitingForNewOperand = true;
        updateDisplay();
    }

 
    function clearCalculator() {
        calculator.currentOperand = '0';
        calculator.previousOperand = '';
        calculator.operation = undefined;
        calculator.waitingForNewOperand = false;
        updateDisplay();
    }

   
    function clearEntry() {
        calculator.currentOperand = '0';
        updateDisplay();
    }

    function deleteDigit() {
        if (calculator.currentOperand.length === 1 || 
            (calculator.currentOperand.length === 2 && calculator.currentOperand.startsWith('-'))) {
            calculator.currentOperand = '0';
        } else {
            calculator.currentOperand = calculator.currentOperand.slice(0, -1);
        }
        updateDisplay();
    }

   
    function memoryClear() {
        calculator.memory = 0;
        showToast('Memory Cleared');
    }

    function memoryRecall() {
        calculator.currentOperand = calculator.memory.toString();
        calculator.waitingForNewOperand = true;
        updateDisplay();
        showToast('Memory Recalled: ' + calculator.memory);
    }

    function memoryAdd() {
        const current = parseFloat(calculator.currentOperand) || 0;
        calculator.memory += current;
        showToast('Added to Memory: ' + current);
    }

    function memorySubtract() {
        const current = parseFloat(calculator.currentOperand) || 0;
        calculator.memory -= current;
        showToast('Subtracted from Memory: ' + current);
    }

   
    function updateHistoryDisplay() {
        historyListElement.innerHTML = '';
        calculator.history.forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div style="color: #ff9500; font-weight: bold;">${item.expression} = ${item.result}</div>
                <small style="color: #888;">${item.timestamp}</small>
            `;
            historyListElement.appendChild(div);
        });
    }

    
    function showToast(message) {
       
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff9500;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;
        
        document.body.appendChild(toast);
        
     
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

   
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    
    function setupEventListeners() {
       
        document.querySelectorAll('.number-btn').forEach(button => {
            button.addEventListener('click', () => {
                const number = button.getAttribute('data-number');
                if (number === '.') {
                    appendDecimal();
                } else {
                    appendNumber(number);
                }
            });
        });

        
        document.querySelectorAll('.operation-btn').forEach(button => {
            button.addEventListener('click', () => {
                const operation = button.getAttribute('data-operation');
                chooseOperation(operation);
            });
        });

        
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.getAttribute('data-action');
                
                switch (action) {
                    case 'clear':
                        clearCalculator();
                        break;
                    case 'clear-entry':
                        clearEntry();
                        break;
                    case 'delete':
                        deleteDigit();
                        break;
                    case 'equals':
                        compute();
                        break;
                    case 'memory-clear':
                        memoryClear();
                        break;
                    case 'memory-recall':
                        memoryRecall();
                        break;
                    case 'memory-add':
                        memoryAdd();
                        break;
                    case 'memory-subtract':
                        memorySubtract();
                        break;
                }
            });
        });

        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.getAttribute('data-theme');
                changeTheme(theme);
                
                themeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        
        viewCodeButton.addEventListener('click', () => {
            showToast('View Code feature would open GitHub repository');
        });

        testKeyboardButton.addEventListener('click', () => {
            showToast('Try pressing: 5 + 3 = (Use keyboard!)');
        });
    }

    
    function setupKeyboardSupport() {
        document.addEventListener('keydown', event => {
            const key = event.key;
            
            if (/[\d+\-*/.=]|Enter|Escape|Backspace/.test(key)) {
                event.preventDefault();
            }
            
            
            if (/[\d]/.test(key)) {
                appendNumber(key);
            } else if (key === '.') {
                appendDecimal();
            } else if (key === '+') {
                chooseOperation('+');
            } else if (key === '-') {
                chooseOperation('−');
            } else if (key === '*') {
                chooseOperation('×');
            } else if (key === '/') {
                chooseOperation('÷');
            } else if (key === 'Enter' || key === '=') {
                compute();
            } else if (key === 'Escape') {
                clearCalculator();
            } else if (key === 'Backspace') {
                deleteDigit();
            }
        });
    }


    function changeTheme(theme) {
        document.body.classList.remove('dark-theme', 'light-theme', 'orange-theme');
        document.body.classList.add(`${theme}-theme`);
        
        
        const themeStyle = document.getElementById('theme-style');
        if (themeStyle) themeStyle.remove();
        
        let styles = '';
        switch (theme) {
            case 'light':
                styles = `
                    body { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); color: #333; }
                    .calculator { background: white; border-color: #ddd; }
                    .display { background: #f8f9fa; border-color: #ddd; color: #333; }
                    .number-btn { background: #e9ecef; color: #333; box-shadow: 0 4px 0 #ced4da; }
                    .number-btn:hover { background: #dee2e6; }
                `;
                break;
            case 'orange':
                styles = `
                    body { background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); }
                    .header, .features-sidebar, .footer { background: rgba(255, 149, 0, 0.1); }
                    .operation-btn { background: linear-gradient(145deg, #ff7b25, #ff5500); }
                `;
                break;
            default: 
                styles = '';
        }
        
        if (styles) {
            const styleElement = document.createElement('style');
            styleElement.id = 'theme-style';
            styleElement.textContent = styles;
            document.head.appendChild(styleElement);
        }
        
        showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme Applied`);
    }

    
    function saveToLocalStorage() {
        localStorage.setItem('calculatorHistory', JSON.stringify(calculator.history));
        localStorage.setItem('calculatorMemory', calculator.memory.toString());
    }

    function loadFromLocalStorage() {
        const savedHistory = localStorage.getItem('calculatorHistory');
        const savedMemory = localStorage.getItem('calculatorMemory');
        
        if (savedHistory) {
            calculator.history = JSON.parse(savedHistory);
            updateHistoryDisplay();
        }
        
        if (savedMemory) {
            calculator.memory = parseFloat(savedMemory);
        }
    }

   
    initCalculator();

    
    setTimeout(() => {
        showToast('Welcome! Calculator ready. Try keyboard: 5 + 3 =');
    }, 1000);
});