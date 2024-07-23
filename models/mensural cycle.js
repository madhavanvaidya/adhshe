document.getElementById('tracker-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const startDate = new Date(document.getElementById('start-date').value);
    const cycleLength = parseInt(document.getElementById('cycle-length').value);
    
    if (isNaN(cycleLength) || cycleLength <= 0) {
        alert('Please enter a valid cycle length.');
        return;
    }
    
    logCycle(startDate, cycleLength);
    updateInsights();
});

let cycles = [];

function logCycle(startDate, cycleLength) {
    cycles.push({ startDate, cycleLength });
    updateCycleList();
}

function updateCycleList() {
    const cycleList = document.getElementById('cycle-list');
    cycleList.innerHTML = '';
    cycles.forEach((cycle, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Cycle ${index + 1}: Start Date - ${cycle.startDate.toDateString()}, Cycle Length - ${cycle.cycleLength} days`;
        cycleList.appendChild(listItem);
    });
}

function updateInsights() {
    const totalCycleLength = cycles.reduce((sum, cycle) => sum + cycle.cycleLength, 0);
    const averageCycleLength = totalCycleLength / cycles.length;
    
    const averageCycleLengthElement = document.getElementById('average-cycle-length');
    averageCycleLengthElement.textContent = `Average Cycle Length: ${averageCycleLength.toFixed(2)} days`;
    
    const lastCycle = cycles[cycles.length - 1];
    const nextPeriodDate = new Date(lastCycle.startDate);
    nextPeriodDate.setDate(lastCycle.startDate.getDate() + averageCycleLength);
    
    const nextPeriodDateElement = document.getElementById('next-period-date');
    nextPeriodDateElement.textContent = `Next Expected Period Date: ${nextPeriodDate.toDateString()}`;
}

