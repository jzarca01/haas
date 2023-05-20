#!/usr/bin/env node --loader ts-node/esm --experimental-specifier-resolution=node

const oclif = require("@oclif/core");

const path = require("path");
const project = path.join(__dirname, "..", "tsconfig.json");

require("ts-node").register({ project });

// In dev mode, always show stack traces
oclif.settings.debug = true;

// Start the CLI
oclif.run().then(oclif.flush).catch(oclif.Errors.handle);
