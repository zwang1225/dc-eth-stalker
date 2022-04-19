const {getTwoMiner, sendAlert} = require("./discord.js");

const schedulerScaner = () =>{
    const checkers = ['worker','worker1','worker2','worker3','worker4']
    const devider = Math.pow(1000, 2);
    const buttomLimit = 980;
    const expectedWorkers = 9;
    const scanMiner = async () =>{
        let result = await getTwoMiner();
        let liveWorkers = result.workers;
        let offLineWorkers = []

        checkers.forEach(worker=>{
            if(!liveWorkers[worker] || liveWorkers[worker].hr === 0) offLineWorkers.push(worker)
        })

        if(result.currentHashrate/devider < buttomLimit){
            sendAlert(`Hashrate under ${buttomLimit}MS`, `The hashrate is under ${buttomLimit}MS, currently ${result.currentHashrate/devider}MS, ${result.workersOnline} workers are online, ${result.workersOffline} workers are offline, please check the miner status`)
        }
        if(result.workersOnline !== expectedWorkers && offLineWorkers.length){
            sendAlert('Worker Offline', `${offLineWorkers.toString()} is Offline please check`)
        }
    }
    const SCANNER_INTERVAL = 200000;
    setInterval(scanMiner, SCANNER_INTERVAL)
}

module.exports = {schedulerScaner}