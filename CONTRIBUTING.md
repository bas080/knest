# Contributing

## Updating dependencies

```bash bash
npx npm-check-updates --cwd "$PWD" --doctor --upgrade
```
```
Running tests before upgrading
npm install
npm run test
Upgrading all dependencies and re-running tests
ncu --cwd /home/ant/projects/knest --upgrade
All dependencies are up-to-date :)
```

## Documentation

Knest uses [markatzea][1] to generate the documentation.

Simply run in your terminal: `$ markatzea CONTRIBUTING.mz > CONTRIBUTING.md`

You can also just generate the README.md by running:

```bash bash
markatzea README.mz > README.md
```

## Thank You

Thank you for reading.

[1]:https://github.com/bas080/markatzea
[2]:https://github.com/bas080/memplate
