//get Heading month and year

const today = new Date();

const m = new Array();
m[0] = "January";
m[1] = "February";
m[2] = "March";
m[3] = "April";
m[4] = "May";
m[5] = "June";
m[6] = "July";
m[7] = "August";
m[8] = "September";
m[9] = "October";
m[10] = "November";
m[11] = "December";
const month = m[today.getMonth()];

const date = month +' '+today.getFullYear();
document.getElementById("monthyear").innerHTML=date;

//Add Data


const select = document.getElementById('incexp');
const desc = document.getElementById('description');
const amt = document.getElementById('amt');
const addbtn = document.getElementById('addbtn');
const tot = document.getElementById('budgettot');
const inc = document.getElementById('incval');
const exp = document.getElementById('expval');
const exper = document.getElementById('exper');

let total = 0.00
let income = 0.00
let expenses = 0.00
let incomes = []
let expensess = []

select.addEventListener('change', e => {
    let bordercol = e.target.value === 'inc' ? '#28b9b5' : '#ff5049'
    console.log("hi");
    desc.addEventListener('focus', (e) => { e.target.style.borderColor = bordercol });
    amt.addEventListener('focus', (e) => { e.target.style.borderColor = bordercol });
    select.addEventListener('focus', (e) => { e.target.style.borderColor = bordercol });
    addbtn.style.color = bordercol;
    select.style.borderColor = bordercol;
})

desc.addEventListener('blur', (e) => { e.target.style.borderColor = '#e7e7e7'; });
amt.addEventListener('blur', (e) => { e.target.style.borderColor = '#e7e7e7'; });
select.addEventListener('blur', (e) => { e.target.style.borderColor = '#e7e7e7'; });

addbtn.addEventListener('click', addData)

function addData() {
    let selecttype = select.value
    let description = desc.value
    let amount = parseFloat(amt.value)
    let per = parseFloat(amt / (total / 100))
    per = (per === Infinity || per < 1) ? '--' : `${Math.round(per)}%`
    
    if (description !== "" && amount > 0) {
        
        let id = (selecttype === 'inc' ? (incomes.length <= 0 ? 0 : incomes[incomes.length - 1].id + 1) : (expensess.length <= 0 ? 0 : expensess[expensess.length - 1].id + 1))
        let data = (selecttype === 'inc' ? { id: id, type: selecttype, description: description, amount: amount } : { id: id, type: selecttype, description: description, amount: amount, per: per })
        selecttype === 'inc' ? incomes.push(data) : expensess.push(data)
        
        headerCalc()
        addDataInHtml(data)
        expensesPer()
        clearValues()
    }
}
function expensesPer() {
    expensess.forEach(exp => {
        const expItem = document.querySelector(`#exp-${exp.id}`)
        let count = exp.amount / (income / 100)
        console.log(count)
        expItem.children[1].children[1].innerText = Math.round(count)+'%'
    })
}
function clearValues() {
    desc.value = ''
    amt.value = ''
}
function addDataInHtml(data) {
    let div = document.createElement('div')
    let divId = `${data.type}-${data.id}`
    let output
    div.classList.add('content')
    div.classList.add('clearfix')
    div.setAttribute('id', divId)
    if (data.type === 'inc') {
        output =
       '<div class="content-data">' + `${data.description}` + '</div><div class="value-btn clearfix"><div class="content-value">' + `+ ${data.amount.toFixed(2)}` + '</div><div class="delete"><button class="content-btn"><i class="far fa-times-circle"></i></button></div></div>'
    } else {
        output='<div class="content-data">' + `${data.description}` + '</div><div class="value-btn clearfix"><div class="content-value expenses-title">' + `- ${data.amount.toFixed(2)}` + '</div><div class="content-per expenses-title"></div><div class="delete"><button class="content-btn expenses-title"><i class="far fa-times-circle"></i></button></div></div>'
        
    }
    div.innerHTML = output
    console.log(div)

    if (data.type === 'inc') {
        document.getElementById('incomes').insertAdjacentElement('beforeend', div)
        document.querySelector(`#${divId}`).children[1].children[1].addEventListener('click', e => deleteData(e))
    } else {
        document.getElementById('expensess').insertAdjacentElement('beforeend', div)
        document.querySelector(`#${divId}`).children[1].children[2].addEventListener('click', e => deleteData(e))
    }
}

function deleteData(e) {
    let deleteId = e.target.parentNode.parentNode.parentNode.parentNode.id
    console.log(deleteId.id)
   document.getElementById(deleteId).remove()
   deleteDataArray(deleteId)
   headerCalc()
    
}
function deleteDataArray(deleteId) {
    split = deleteId.split("-");
    type = split[0];
    ID = parseInt(split[1]);
    type === 'inc' ? incomes = incomes.filter(e => e.id != ID ) : expensess = expensess.filter(e => e.id != ID )
}

function headerCalc()
 {
    total = 0.00
    income = 0.00
    expenses = 0.00
    incomes.forEach(e => income += e.amount)
    expensess.forEach(e => expenses += e.amount)
    total = income - expenses
    console.log(total)

    inc.innerText = `+ ${income.toFixed(2)}`
     exp.innerText = `- ${expenses.toFixed(2)}`
     tot.innerText = total.toFixed(2)
     let totper = parseFloat(expenses / (income / 100))
     exper.innerText = Math.round(totper)+'%'
}