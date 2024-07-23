function calculate() {
    let initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
    let monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value);
    let expenses = parseFloat(document.getElementById('expenses').value);
    let interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    let inflationRate = parseFloat(document.getElementById('inflationRate').value) / 100;
    let period = 10; // Suponiendo un periodo de 10 años

    let annualIncome = (monthlyIncome * 12);
    let annualExpenses = expenses * 12;
    let netAnnualIncome = annualIncome - annualExpenses;
    let totalIncome = netAnnualIncome * period;
    let payback = initialInvestment / netAnnualIncome;
    let requiredReturn = interestRate + inflationRate;
    let capitalizationFactor = 1 / requiredReturn;
    let updatedCapital = initialInvestment * Math.pow((1 + inflationRate), period);
    let rentabilidadFlujoTotal = (totalIncome - initialInvestment) / initialInvestment * 100;
    let rentabilidadFlujoMedio = rentabilidadFlujoTotal / period;

    // Cálculo preciso de la TIR utilizando el método de Newton-Raphson
    function irr(cashFlows, guess = 0.1) {
        const maxIterations = 1000;
        const precision = 1e-7;

        let rate = guess;

        for (let i = 0; i < maxIterations; i++) {
            let npv = 0;
            let npvDerivative = 0;

            for (let t = 0; t < cashFlows.length; t++) {
                npv += cashFlows[t] / Math.pow(1 + rate, t);
                npvDerivative -= t * cashFlows[t] / Math.pow(1 + rate, t + 1);
            }

            let newRate = rate - npv / npvDerivative;

            if (Math.abs(newRate - rate) < precision) {
                return newRate;
            }

            rate = newRate;
        }

        return rate;
    }

    let cashFlows = [-initialInvestment];
    for (let t = 1; t <= period; t++) {
        cashFlows.push(netAnnualIncome);
    }

    let tir = irr(cashFlows) * 100;

    // VPN
    let vpn = 0;
    for (let t = 1; t <= period; t++) {
        vpn += netAnnualIncome / Math.pow((1 + requiredReturn), t);
    }
    vpn -= initialInvestment;

    // Verificar si es rentable
    let rentable = vpn > 0 ? "La inversión es rentable" : "La inversión no es rentable";

    document.getElementById('results').innerHTML = `
        <h3>Resultados:</h3>
        <p>Rentabilidad flujo total: ${rentabilidadFlujoTotal.toFixed(2)}%</p>
        <p>Rentabilidad flujo medio: ${rentabilidadFlujoMedio.toFixed(2)}%</p>
        <p>Payback: ${payback.toFixed(2)} años</p>
        <p>Rentabilidad exigida cuando hay inflación (K): ${(requiredReturn * 100).toFixed(2)}%</p>
        <p>Factor de capitalización: ${capitalizationFactor.toFixed(2)}</p>
        <p>Valor que tendrá el capital actualizado: $${updatedCapital.toFixed(2)}</p>
        <p>TIR: ${tir.toFixed(2)}%</p>
        <p>VPN: $${vpn.toFixed(2)}</p>
    `;
}
