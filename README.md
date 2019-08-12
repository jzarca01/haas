HaaS - Houmous as a Service
====

![logo](./logo.png)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/haas.svg)](https://npmjs.org/package/haas)
[![Downloads/week](https://img.shields.io/npm/dw/haas.svg)](https://npmjs.org/package/haas)
[![License](https://img.shields.io/npm/l/haas.svg)](https://github.com/jzarca01/haas/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g haas
$ houmous COMMAND
running command...
$ houmous (-v|--version|version)
haas/0.0.1 darwin-x64 node-v10.13.0
$ houmous --help [COMMAND]
USAGE
  $ houmous COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`houmous signup`](#houmous-signup)
* [`houmous login`](#houmous-login)
* [`houmous logout`](#houmous-logout)
* [`houmous place`](#houmous-place)
* [`houmous help [COMMAND]`](#houmous-help-command)

## `houmous signup`

Gestion de l'inscription de l'utilisateur

```
USAGE
  $ houmous signup
```

_See code: [src/commands/signup.js](./src/commands/signup.js)_

## `houmous login`

Gestion de la connexion de l'utilisateur

```
USAGE
  $ houmous login

OPTIONS
  -e, --email=zz@zz.com
  -p, --password=123456
```

_See code: [src/commands/login.js](./src/commands/login.js)_

## `houmous logout`

Gestion de la déconnexion de l'utilisateur

```
USAGE
  $ houmous logout
```

_See code: [src/commands/logout.js](./src/commands/logout.js)_

## `houmous place`

Gestion des adresses liées à un compte HaaS

```
USAGE
  $ houmous place

ARGUMENTS
  add ajouter une adresse
  list lister les adresses enregistrées
```

_See code: [src/commands/place.js](./src/commands/place.js)_

## `houmous help [COMMAND]`

display help for houmous

```
USAGE
  $ houmous help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_
<!-- commandsstop -->
