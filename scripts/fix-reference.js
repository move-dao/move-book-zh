#!/usr/bin/env node

const fs = require('fs')

async function main() {
    const basePath = 'src'
    const dirs = fs.readdirSync(`${basePath}`)
    const refs = dirs.reduce((acc, dir) => {
        const res = dir.match(/^chapter_\d+_(.*)$/)
        if (res === null) return acc
        acc.push(res)
        return acc
    }, [])
    for (const dir of dirs) {
        const filePath = `${basePath}/${dir}`
        if (fs.lstatSync(filePath).isDirectory()) continue
        const fileOld = fs.readFileSync(filePath).toString()
        let fileNew = fileOld
        for (const ref of refs) {
            fileNew = fileNew.replaceAll(`./${ref[1]}`, `./${ref[0]}`)
        }
        if (fileNew !== fileOld) {
            fs.writeFileSync(filePath, fileNew)
        }
    }
    console.log('fix reference done.')
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
