const { default: axios } = require("axios");
const Discord = require("discord.js");
const convert = require('ether-converter');

const client = new Discord.Client();
const hook = new Discord.WebhookClient(
  "845392397546684476",
  "1p3jGUfDsdA2RMgvcg1FewWdth_VrjifUpN97-1NN7HrMLSee0a2JC5IM_J2uJRQyBWF"
);

const { BOT_TOKEN, botswanaMap, NEWS_API_KEY, ETH_SCAN_API_KEY } = require("./constants.js");
const { getTodayByFormat } = require("../untils/helpers")

const startDiscordBot = () => {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("message", (msg) => {
    let content = msg.content;
    if (content.startsWith("bot")) {
      let key = content.slice(4);

      if (key.startsWith("news:")) {
        let searchTerm = key.slice(4);
        getNews(searchTerm).then((news) => {
          hook.send({
            embeds: news,
          });
        }).catch(err=>{
          msg.channel.send("nothing is here");
        })
        return;
      }

      if(key.startsWith("price")){
        getPrice().then(data=>{
          msg.channel.send(`Current ETH price to USD: ${data.result.ethusd}`);
        }).catch(err=>{
          msg.channel.send("price not working now");
        })
        return;
      }

      if(key.startsWith("2miner")){
        getTwoMiner().then(async data=>{
          let {currentHashrate, hashrate } = data;
          let tem = await getPrice();
          let ethusd = tem.result.ethusd;
          let eth = convert(data["24hreward"], 'gwei', 'ether');
          msg.channel.send(new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Mining for 0xbbed561ad3ff3b6686e2459ac1a968324c2cc374')
          .setURL('https://eth.2miners.com/zh/account/0xbbed561ad3ff3b6686e2459ac1a968324c2cc374')
          .addField("current hashrate", currentHashrate/1000/1000)
          .addField("avg hashrate", hashrate/1000/1000)
          .addField("24 reward", eth)
          .addField("24 reward usd", eth/1 * parseInt(ethusd)))
        })
        return;
      }

      if(key.startsWith("wallet")){
        msg.channel.send(new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Status for 0xbbed561ad3ff3b6686e2459ac1a968324c2cc374')
        .setURL('https://etherscan.io/address/0xbbed561ad3ff3b6686e2459ac1a968324c2cc374'))
        return;
      }

      if(key.startsWith("balance")){
        getAccount().then(async data=>{
          let tem = await getPrice();
          let ethusd = tem.result.ethusd;
          let eth = convert(data.result, 'wei', 'ether')
          msg.channel.send(`wallet has eth ${eth}, usd ${eth/1 * parseInt(ethusd)}`)
        })
        return;
      }

      if(key.startsWith("hashrate")){
        getHashrate().then(data=>{
          let hashrate = data.data.hashrate;
          msg.channel.send("Current overall hashrate: " + hashrate/1000000000000 + " TH")
        })
        return;
      }

      if(key.startsWith("binance")){
        msg.channel.send(new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Binance ETH|USD')
        .setURL('https://www.binance.com/en/trade/ETH_BUSD?type=spot'))
        return;
      }

      if (key.startsWith("help")) {
        msg.channel.send(new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Here is the functions you can use')
        .addFields(
          { name: 'bot news:keywords', value: 'search for latest 10 news with keywords' },
          { name: 'bot price', value: 'latest eth|usd price' },
          { name: 'bot wallet', value: 'status for mining wallet' },
          { name: 'bot 2miner', value: '2miner status' },
          { name: 'bot balance', value: 'give you balance of current mine wallet' },
          { name: 'bot hashrate', value: 'current overall hashrate' },
          { name: 'bot binance', value: 'binance ETH|USD' }
        )
        );
      } else {
        axios.get("https://api.thedogapi.com/v1/images/search").then(res=>res.data).then(res=>{
          msg.channel.send(new Discord.MessageEmbed()
          .setTitle('Do not understand here is a picture of dog')
          .setImage(res[0].url))
        })
      }
    }
  });

  client.login(BOT_TOKEN);
};

const getNews = (searchTerm) => {
  return axios
    .get(
      `https://newsapi.org/v2/everything?q="${searchTerm}"&domains=yahoo.com&from=${getTodayByFormat()}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    )
    .then((res) => res.data)
    .then((res) => {
      if (res.status === "ok") {
        let resultArray = [];
        let articles = res.articles;
        for(let i = 0; i < 10; i++){
          let { title, description, urlToImage, url, author, publishedAt } = articles[i];
          resultArray.push(new Discord.MessageEmbed()
          .setTitle(title)
          .setDescription(description)
          .setTimestamp(publishedAt)
          .setAuthor(author)
          .setThumbnail(urlToImage)
          .setURL(url))
        }
        return resultArray;
      }
    })
};

const getTwoMiner = (account="0xbbed561ad3ff3b6686e2459ac1a968324c2cc374") =>{
  return axios.get(`https://eth.2miners.com/api/accounts/${account}`).then(res=>res.data)
}

const getPrice = () =>{
  return axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${ETH_SCAN_API_KEY}`).then(res=>res.data)
}

const getAccount = (account="0xbbed561ad3ff3b6686e2459ac1a968324c2cc374") =>{
  return axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${account}&tag=latest&apikey=${ETH_SCAN_API_KEY}`).then(res=>res.data)
}

const getHashrate = () =>{
  sendAlert('worker is not working')

  return axios.get(`https://api.ethermine.org/networkStats`).then(res=>res.data)
}

const sendAlert = (title, content) => {
  let channel = client.channels.cache.get("845363690668949537")
  channel.send(new Discord.MessageEmbed()
  .setColor('#cc3300')
  .setTitle('WARNING!!')
  .setURL('https://eth.2miners.com/zh/account/0xbbed561ad3ff3b6686e2459ac1a968324c2cc374')
  .addField("Warning: ", content)
  )
}

module.exports = {startDiscordBot, getTwoMiner, sendAlert};
