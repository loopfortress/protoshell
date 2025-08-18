# Loop ProtoShell
===============

ProtoShell is a lightweight command-line utility designed to enhance your development workflow by watching file changes and running user-defined commands.
It is particularly useful for projects with multiple roots, such as monorepos, where managing file watchers and build steps can quickly become complicated.

## Key Features
- 🔄 **File Watching**: Automates task execution by watching for file changes.
- ⚙ **Configurable Runners**: Define what to watch and what commands to run through JSON config files.
- 📂 **Multi-Root Support**: Simplifies workflows in monorepo setups by defining multiple roots treated as separate projects.
- 🚀 **Fast Setup**: Minimal configuration required to start.

## Installation

Install globally via npm or your preferred package manager (using **pnpm** in this example):

```shell
pnpm add -g @loopfortress/protoshell
```

This will make the `protoshell` command available globally on your system.

## Usage

### Running ProtoShell

Run the tool by navigating to your project folder and executing:

```shell
protoshell
```

By default, it looks for a `.protoshell.json` file in the project root.
You can specify a custom config file location by setting the `PROTOSHELL_CONFIG` environment variable: 

```shell
export PROTOSHELL_CONFIG=/path/to/your/.protoshell.json
protoshell
```

### Initializing Configuration Files

ProtoShell provides an `init` subcommand to help you create configuration files:

```shell
# Initialize a .protoshell.json file in the current directory
protoshell init

# Initialize a .autocompile.json file in the current directory
protoshell init --project
```

The `init` command creates a template configuration file that you can customize for your project:
- Without the `--project` flag, it creates a `.protoshell.json` file for global configuration
- With the `--project` flag, it creates a `.autocompile.json` file for project-specific runner configuration

### Configuration Files

ProtoShell requires two types of configuration files to function:

1. **Global Configuration** (`.protoshell.json`): Defines root-level properties and projects to watch.

```json
{
 "autocompile": {
   "repo": {
     "path": "."
   }
 }
}
```

2. **Runner Configuration** (`.autocompile.json` in each project): Defines which files to watch and what commands to run.

```json
{
 "runners": {
   "typescript": {
     "watch": [
       {
         "match": "**/*.ts",
         "ignore": "**/*.d.ts"
       }
     ],
     "interpreter": "pnpm",
     "command": "tsc"
   }
 }
}
```

These configurations are validated against JSON schemas to ensure correctness.

## Example Workflow

### Monorepo Setup Example

If your project uses a monorepo structure, you can define each sub-project in a global `.protoshell.json` file.

#### Example `.protoshell.json` (Global Config) 

```json
{
  "autocompile": {
    "projectA": {
      "path": "./packages/projectA"
    },
    "projectB": {
      "path": "./packages/projectB"
    }
  }
}
```

Each sub-project can then include its own `.autocompile.json` to define files being watched and tasks to execute.

#### Example `.autocompile.json` for `projectA` 

```json
{
  "runners": {
    "build": {
      "watch": [
        {
          "match": "**/*.js",
          "ignore": "node_modules/**"
        }
      ],
      "interpreter": "npm",
      "command": "build"
    }
  }
}
```

By running `protoshell`, ProtoShell will automatically watch the files and trigger the runners you’ve defined across all sub-projects.

## Logging

- `LOG_INFO`: `"true"`|`"false"` (Default: `true`) Disable or enable info level logs.
- `LOG_DEBUG`: `"true"`|`"false"` (Default: `true`) Disable or enable debug logs.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request. Always ensure your contributions comply with the project's coding standards and pass validation.

## License

This project is licensed under the MIT License. See the [license](license) file for details.
