#!/usr/bin/env node

const fs = require('fs')

async function main() {
    const basePath = 'src'
    let newSummary = fs.readFileSync(`./${basePath}/SUMMARY.md`).toString().replace(/chapter_\d+_/g,"")
    fs.writeFileSync(`${basePath}/SUMMARY.md`, newSummary)
    console.log('fix summary done.')
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})