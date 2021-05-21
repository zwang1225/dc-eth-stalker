const { default: axios } = require("axios");
const Discord = require("discord.js");

const client = new Discord.Client();
const hook = new Discord.WebhookClient(
  "845392397546684476",
  "1p3jGUfDsdA2RMgvcg1FewWdth_VrjifUpN97-1NN7HrMLSee0a2JC5IM_J2uJRQyBWF"
);

const { BOT_TOKEN, botswanaMap } = require("./constants.js");
const { getTodayByFormat } = require("../untils/helpers")

const startDiscordBot = () => {
  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("message", (msg) => {
    let content = msg.content;
    if (content.startsWith("!wana")) {
      let key = content.slice(6);

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

      if (!!botswanaMap[key]) {
        msg.channel.send(botswanaMap[key]);
      } else {
        msg.channel.send("Say something with meaning");
      }
    }
  });

  client.login(BOT_TOKEN);
};

const getNews = (searchTerm) => {
  return axios
    .get(
      `https://newsapi.org/v2/everything?q="${searchTerm}"&domains=yahoo.com&from=${getTodayByFormat()}&sortBy=publishedAt&apiKey=6bf9d4a34944420b9917e1eb193239bb`
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
          .addField("Link", `${url}`))
          
        }
        return resultArray;
      }
    })
};

const getPrice = () =>{

}

module.exports = startDiscordBot;
