import { readFile } from 'node:fs/promises'
import { multiselect, text } from '@clack/prompts'
import cac from 'cac'
import { findUp } from 'find-up'
import { parse } from 'yaml'
import { resolveConfig } from '@/config.ts'
import { name, version } from '../package.json'

const cli = cac(name)

cli.command('')
    .action(async (options) => {
        const config = resolveConfig()
        const pnpmWorkSpacePath = await findUp('pnpm-workspace.yaml', {
            cwd: config.cwd,
        })

        if (!pnpmWorkSpacePath) {
            return 'no has pnpm-workspace.yaml'
        }

        const context = parse(await readFile(pnpmWorkSpacePath, 'utf-8'))

        if (!context.catalog) {
            return '暂无 catalog'
        }

        const catalog = context.catalog

        const choice = await multiselect({
            message: '选择要切换的包',
            options: Object.keys(catalog).map(key => ({
                value: key,
                label: key,
            })),

        })

        const catalogsName = await text({
            message: '请输入分类名称',
            placeholder: '',
            defaultValue: '',
        })

        console.log({ choice, catalogsName })
    })

cli.help()
cli.version(version)
cli.parse()
