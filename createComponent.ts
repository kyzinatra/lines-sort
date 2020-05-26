import { join } from "path";
import { writeFileSync, mkdirSync } from "fs";

const [, , ...names] = process.argv
const componentsPath = 'src/components'

function formatName(names: string[]) {
  return [...names].map(name).join('')
}

function formatClassName(names: string[]) {
  return [...names].map(className).join('-')
}


function className(name: string) {
  return name.toLowerCase()
}

function name(name: string) {
  return name.substr(0, 1).toUpperCase() +
    name.substr(1).toLocaleLowerCase()
}

const fileName = formatName(names)
const packageName = formatClassName(names)
const componentName = fileName + 'Component'
const componentClassName = packageName + '-component'

const tsTemplate = `
import React from "react";
import { useState } from "react";

import "./${fileName}.sass";

export interface I${componentName}Props {

}

export interface I${componentName}State {

}

export const ${componentName} = (props: I${componentName}Props) => {
  const [state, setState] = useState<I${componentName}State>({})

  return (
    <div className="${componentClassName}">

    </div>
  )
}
`.trim()

const sassTemplate = `
.${componentClassName}
  margin: 0
  padding: 0
`.trim()

const packageTemplate = `
{
  "name": "${packageName}",
  "version": "0.0.1",
  "main": "${fileName}.tsx"
}
`.trim()

if (!fileName)
  process.exit(0)

try {
  mkdirSync(join(componentsPath, fileName))
  writeFileSync(join(componentsPath, fileName, fileName + '.tsx'), tsTemplate)
  writeFileSync(join(componentsPath, fileName, fileName + '.sass'), sassTemplate)
  writeFileSync(join(componentsPath, fileName, 'package.json'), packageTemplate)
} catch (e) { console.error(e.message) }