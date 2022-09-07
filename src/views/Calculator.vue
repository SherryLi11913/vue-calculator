<template>
    <div class="calculator-container">
        <div id="output">{{ output }}</div>

        <div 
            id="clear" 
            class="operator-dark"
            @click="clear"
        >
            {{ canBeReset ? 'AC' : 'C'}}
        </div>

        <div
            v-for="operator in operators"
            :key="operator.id"
            :id="operator.id"
            :class="operator.class"
            :style="{ gridArea: operator.id }"
            @click="clickOperator(operator.symbol)"
        >
            {{ operator.symbol }}
        </div>

        <div
            v-for="num in nums"
            :key="num"
            :id="`num${num}`"
            class="num"
            :style="{ gridArea: `num${num}` }"
            @click="clickNum(num)"
        >
            {{ num }}
        </div>

        <div 
            id="dot" 
            class="num" 
            ref="dot"
            @click="clickNum('.')"
        >
            .
        </div>
    </div>
</template>

<script>
export default {
    name: 'CalculatorView',
    data() {
        return {
            previousNum: 0,
            currentNum: 0,
            currentOperator: '',
            dotClicked: false,
            displayCurrentNum: true,
            nums: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            operators: [
                {
                    id: 'negative',
                    class: 'operator-dark',
                    symbol: '+/-',
                },
                {
                    id: 'percentage',
                    class: 'operator-dark',
                    symbol: '%',
                },
                {
                    id: 'divide',
                    class: 'operator-orange',
                    symbol: '÷',
                },
                {
                    id: 'multiply',
                    class: 'operator-orange',
                    symbol: '×',
                },
                {
                    id: 'minus',
                    class: 'operator-orange',
                    symbol: '-',
                },
                {
                    id: 'plus',
                    class: 'operator-orange',
                    symbol: '+',
                },
                {
                    id: 'equal',
                    class: 'operator-orange',
                    symbol: '=',
                }
            ],
        };
    },
    computed: {
        canBeReset() {
            return !this.currentNum && !this.previousNum;
        },
        output() {
            return this.displayCurrentNum ? this.currentNum : parseFloat((this.previousNum).toPrecision(16));
        },
    },
    mounted() {
        document.addEventListener('keydown', this.keyPressed);
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.keyPressed);
    },
    methods: {
        clickNum(num) {
            if (num === '.') {
                if (!this.dotClicked) {
                    this.dotClicked = true;
                    this.currentNum += '.';
                }
            } else {
                if (this.dotClicked) {
                    this.currentNum += num;
                } else {
                    this.currentNum = this.currentNum * 10 + num;
                }
            }
            this.displayCurrentNum = true;
        },
        clickOperator(operator) {
            switch(operator) {
                case '=':
                case 'Enter':
                    if (this.displayCurrentNum) {
                        this.calculate();
                    }
                    this.currentOperator = '';
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '÷':
                case '×':
                    if (this.currentOperator && this.displayCurrentNum) {
                        this.calculate();
                    } else if (!this.currentOperator && this.displayCurrentNum) {
                        this.previousNum = this.currentNum;
                        this.currentNum = 0;
                        this.displayCurrentNum = false;
                    }
                    this.currentOperator = operator;
                    break;
                case '+/-':
                    if (this.displayCurrentNum) {
                        this.currentNum = -Number(this.currentNum);
                    } else {
                        this.currentNum = -Number(this.previousNum);
                        this.previousNum = 0;
                    }
                    this.displayCurrentNum = true;
                    break;
                case '%':
                    if (this.displayCurrentNum) {
                        this.currentNum = parseFloat(this.currentNum) / 100.0;
                    } else {
                        this.currentNum = parseFloat(this.previousNum) / 100.0;
                        this.previousNum = 0;
                    }
                    this.displayCurrentNum = true;
                    break;
                default:
                    break;
            }
        },
        calculate() {
            switch(this.currentOperator) {
                case '+':
                    this.previousNum = parseFloat(this.previousNum) + parseFloat(this.currentNum);
                    break;
                case '-':
                    this.previousNum = parseFloat(this.previousNum) - parseFloat(this.currentNum);
                    break;
                case '*':
                case '×':
                    this.previousNum = parseFloat(this.previousNum) * parseFloat(this.currentNum);
                    break;
                case '/':
                case '÷':
                    if (this.currentNum === 0) {
                        this.previousNum = NaN;
                    } else {
                        this.previousNum = parseFloat(this.previousNum) / parseFloat(this.currentNum);
                    }
                    break;
                default:
                    break;
            }
            this.displayCurrentNum = false;
            this.currentNum = 0;
        },
        clear() {
            this.currentNum = 0;
            this.displayCurrentNum = true;
            this.previousNum = 0;
            this.currentOperator = '';
            this.dotClicked = false;
        },
        keyPressed(event) {
            switch(event.key) {
                // Numbers
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':
                    document.querySelector(`#num${event.key}`).classList.add('num-clicked');
                    this.clickNum(parseInt(event.key));
                    setTimeout(() => {
                        document.querySelector(`#num${event.key}`).classList.remove('num-clicked');
                    }, 50);
                    break;
                case '.':
                    document.querySelector(`#dot`).classList.add('num-clicked');
                    this.clickNum('.');
                    setTimeout(() => {
                        document.querySelector(`#dot`).classList.remove('num-clicked');
                    }, 50);
                    break;
                // Operators
                case '+':
                    document.querySelector(`#plus`).classList.add('operator-orange-clicked');
                    this.clickOperator(event.key);
                    setTimeout(() => {
                        document.querySelector(`#plus`).classList.remove('operator-orange-clicked');
                    }, 50);
                    break;
                case '-':
                    document.querySelector(`#minus`).classList.add('operator-orange-clicked');
                    this.clickOperator(event.key);
                    setTimeout(() => {
                        document.querySelector(`#minus`).classList.remove('operator-orange-clicked');
                    }, 50);
                    break;
                case '*':
                    document.querySelector(`#multiply`).classList.add('operator-orange-clicked');
                    this.clickOperator(event.key);
                    setTimeout(() => {
                        document.querySelector(`#multiply`).classList.remove('operator-orange-clicked');
                    }, 50);
                    break;
                case '/':
                    document.querySelector(`#divide`).classList.add('operator-orange-clicked');
                    this.clickOperator(event.key);
                    setTimeout(() => {
                        document.querySelector(`#divide`).classList.remove('operator-orange-clicked');
                    }, 50);
                    break;
                case '%':
                    document.querySelector(`#percentage`).classList.add('operator-dark-clicked');
                    this.clickOperator(event.key);
                    setTimeout(() => {
                        document.querySelector(`#percentage`).classList.remove('operator-dark-clicked');
                    }, 50);
                    break;
                case '=':
                case 'Enter':
                    document.querySelector(`#equal`).classList.add('operator-orange-clicked');
                    this.clickOperator(event.key);
                    setTimeout(() => {
                        document.querySelector(`#equal`).classList.remove('operator-orange-clicked');
                    }, 50);
                    break;
                default:
                    break;
            }
        }
    },
}
</script>

<style scoped>
.calculator-container {
    width: 75%;
    margin: 30px auto;
    color: #fff;
    font-size: 20px;
    font-weight: 500;
    display: grid;
    grid-template: "output output output output" 70px
                   "clear negative percentage divide" 70px
                   "num7 num8 num9 multiply" 70px
                   "num4 num5 num6 minus" 70px
                   "num1 num2 num3 plus" 70px
                   "num0 num0 dot equal" 70px / 70px 70px 70px 70px;
    justify-content: center;
}

.calculator-container > div {
    height: 100%;
    box-sizing: border-box;
    cursor: default;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.operator-dark {
    background: #333;
    border-right: 1px solid black;
    border-top: 1px solid black;
}

.operator-dark:active, .operator-dark-clicked {
    background: #A8A8A8;
}

.operator-orange {
    background: #FF9601;
    border-top: 1px solid black;
}

.operator-orange:active, .operator-orange-clicked {
    background: #c77400;
}

.current-operator {
    border: 2px solid black;
    border-right: 0;
    height: calc(100% - 3px) !important;
}

.num {
    background: #A8A8A8;
    border-right: 1px solid black;
    border-top: 1px solid black;
}

.num:active, .num-clicked {
    background: #D4D4D2;
}

#output {
    grid-area: output;
    height: calc(100% - 20px);
    padding: 10px 15px;
    background: #505050;
    border-radius: 10px 10px 0 0;
    box-sizing: content-box;
    font-size: 28px;
    justify-content: flex-end;
    align-items: flex-end;
}

#clear {
    grid-area: clear;
}

#dot {
    grid-area: dot;
}

#equal {
    border-radius: 0 0 10px 0;
}

#num0 {
    border-radius: 0 0 0 10px;
}
</style>