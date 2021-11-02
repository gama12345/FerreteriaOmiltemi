
//Returns to index.html
const backToLogin = () => location.href = "/index.html";

const goDashboard = () => location.href = "/dashboard.html"

const backToStockView = () => location.href = '../stock/view.html';

export { backToLogin, goDashboard, backToStockView }