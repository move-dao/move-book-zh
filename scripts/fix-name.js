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

        for (const ref of refs) {
            fs.rename(`${basePath}/${ref[0]}`, `${basePath}/${ref[1]}`, err => {
                throw err
            })
        }
    }
    console.log('fix name done.')
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})