import axios from 'axios'
import { Rcon } from 'rcon-client'

const sendDiscordWebhook = ({shopid, db, nick, serviceName}) => {
  return new Promise((resolve, reject) => {
    db.child(`shops/${shopid}/webhook`).once('value', (snapshot) => {
      if (snapshot.exists() && snapshot.val() !== '') {
        axios.post(snapshot.val(), {
          content: `${nick} właśnie kupił(a) ${serviceName}`
        }).then(() => {
          resolve()
        }).catch(() => {
          reject('discord_webhook_error')
        })
      } else {
        resolve()
      }
    })
  })
}

const sendRconCommands = ({commands, nick, host, port, password}) => {
  return new Promise((resolve, reject) => {
    let count = 0
    commands = commands.split('\n')
    for (let command of commands) {
      command = command.replace(/\[nick\]/g, nick)
      Rcon.connect({host, port, password}).then((rcon) => {
        rcon.send(command).then((response) => {
          count++
          if (count === commands.length) {
            resolve(response)
          }
        }).catch((e) => {
          reject('command_error')
        })
      }).catch((e) => {
        reject('auth_error')
      })
    }
  })
}

module.exports = {sendDiscordWebhook, sendRconCommands}
