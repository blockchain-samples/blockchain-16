## simple implementation of blockchain in typescript

### installation
```sh
$ git clone {repo}
$ cd {repo root}
$ yarn install
$ yarn link
```

### configuration
Width cli app
```sh
$ configurate
```
Rewrite config files in {root}/config
Available flags:
| File | Description |
| ------ | ------ |
| network.json | network configuration |
| genesis.json | make your own genesis block |
| coinbase.json | wallet configuration |

### run blockchain
```sh
$ coin [flags]
```
Available flags:
| Flag | Description |
| ------ | ------ |
| --help, -v | show available flags with descrioption |
| --version, -v | version of blockchain |
| --logs, -lg | show logging |
| --mining, -m | enable mining |
| --http | enable additional API http server | 
