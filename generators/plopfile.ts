import type { NodePlopAPI } from "plop";

export default function plopfile(plop: NodePlopAPI) {
    plop.setGenerator("fsd:feature", {
        description: "FSD Featureを生成します",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Feature名を入力してください（例: blog-preview）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Feature名は必須です";
                    }
                    if (!/^[a-z0-9-]+$/.test(value)) {
                        return "Feature名は小文字、数字、ハイフンのみ使用できます";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "componentName",
                message: "コンポーネント名を入力してください（例: BlogPreview）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "コンポーネント名は必須です";
                    }
                    if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
                        return "コンポーネント名はPascalCaseで入力してください";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "app",
                message: "アプリ名を入力してください（例: web）:",
                default: "web",
            },
        ],
        actions: [
            {
                type: "add",
                path: "apps/{{app}}/app/features/{{name}}/ui/{{componentName}}.tsx",
                templateFile: "templates/fsd/feature/ui.ts.hbs",
            },
            {
                type: "add",
                path: "apps/{{app}}/app/features/{{name}}/model/types.ts",
                templateFile: "templates/fsd/feature/model.ts.hbs",
            },
            {
                type: "add",
                path: "apps/{{app}}/app/features/{{name}}/index.ts",
                templateFile: "templates/fsd/feature/index.ts.hbs",
            },
        ],
    });

    plop.setGenerator("fsd:entity", {
        description: "FSD Entityを生成します",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Entity名を入力してください（例: blog）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Entity名は必須です";
                    }
                    if (!/^[a-z0-9-]+$/.test(value)) {
                        return "Entity名は小文字、数字、ハイフンのみ使用できます";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "app",
                message: "アプリ名を入力してください（例: web）:",
                default: "web",
            },
        ],
        actions: [
            {
                type: "add",
                path: "apps/{{app}}/app/entities/{{name}}/model/types.ts",
                templateFile: "templates/fsd/entity/types.ts.hbs",
            },
            {
                type: "add",
                path: "apps/{{app}}/app/entities/{{name}}/index.ts",
                templateFile: "templates/fsd/entity/index.ts.hbs",
            },
        ],
    });

    plop.setGenerator("fsd:widget", {
        description: "FSD Widgetを生成します",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Widget名を入力してください（例: blog-list）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Widget名は必須です";
                    }
                    if (!/^[a-z0-9-]+$/.test(value)) {
                        return "Widget名は小文字、数字、ハイフンのみ使用できます";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "componentName",
                message: "コンポーネント名を入力してください（例: BlogList）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "コンポーネント名は必須です";
                    }
                    if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
                        return "コンポーネント名はPascalCaseで入力してください";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "app",
                message: "アプリ名を入力してください（例: web）:",
                default: "web",
            },
        ],
        actions: [
            {
                type: "add",
                path: "apps/{{app}}/app/widgets/{{name}}/ui/{{componentName}}.tsx",
                templateFile: "templates/fsd/widget/ui.ts.hbs",
            },
            {
                type: "add",
                path: "apps/{{app}}/app/widgets/{{name}}/index.ts",
                templateFile: "templates/fsd/widget/index.ts.hbs",
            },
        ],
    });

    plop.setGenerator("ddd:domain", {
        description: "DDD Domainを生成します",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Domain名を入力してください（例: post）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Domain名は必須です";
                    }
                    if (!/^[a-z0-9-]+$/.test(value)) {
                        return "Domain名は小文字、数字、ハイフンのみ使用できます";
                    }
                    return true;
                },
            },
        ],
        actions: [
            {
                type: "add",
                path: "apps/api/app/domain/{{name}}.ts",
                templateFile: "templates/ddd/domain.ts.hbs",
            },
        ],
    });

    plop.setGenerator("ddd:usecase", {
        description: "DDD UseCaseを生成します",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "UseCase名を入力してください（例: GetPost）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "UseCase名は必須です";
                    }
                    if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
                        return "UseCase名はPascalCaseで入力してください";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "domain",
                message: "Domain名を入力してください（例: post）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Domain名は必須です";
                    }
                    return true;
                },
            },
        ],
        actions: [
            {
                type: "add",
                path: "apps/api/app/usecase/{{kebabCase name}}.ts",
                templateFile: "templates/ddd/usecase.ts.hbs",
            },
        ],
    });

    plop.setGenerator("ddd:repository", {
        description: "DDD Infrastructure Repositoryを生成します",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Repository名を入力してください（例: post）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Repository名は必須です";
                    }
                    if (!/^[a-z0-9-]+$/.test(value)) {
                        return "Repository名は小文字、数字、ハイフンのみ使用できます";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "domain",
                message: "Domain名を入力してください（例: post）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Domain名は必須です";
                    }
                    return true;
                },
            },
        ],
        actions: [
            {
                type: "add",
                path: "apps/api/app/infra/{{name}}.repository.ts",
                templateFile: "templates/ddd/repository.ts.hbs",
            },
        ],
    });

    plop.setGenerator("ddd:rest-handler", {
        description: "DDD REST Handlerを生成します",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Handler名を入力してください（例: posts）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Handler名は必須です";
                    }
                    if (!/^[a-z0-9-]+$/.test(value)) {
                        return "Handler名は小文字、数字、ハイフンのみ使用できます";
                    }
                    return true;
                },
            },
        ],
        actions: [
            {
                type: "add",
                path: "apps/api/src/interface/rest/{{name}}.ts",
                templateFile: "templates/ddd/rest-handler.ts.hbs",
            },
        ],
    });

    plop.setGenerator("component", {
        description: "UI Componentを生成します",
        prompts: [
            {
                type: "input",
                name: "name",
                message: "Component名を入力してください（例: Button）:",
                validate: (value: string) => {
                    if (!value || value.trim().length === 0) {
                        return "Component名は必須です";
                    }
                    if (!/^[A-Z][a-zA-Z0-9]*$/.test(value)) {
                        return "Component名はPascalCaseで入力してください";
                    }
                    return true;
                },
            },
        ],
        actions: [
            {
                type: "add",
                path: "packages/ui/src/components/{{name}}.tsx",
                templateFile: "templates/component/component.tsx.hbs",
            },
            {
                type: "add",
                path: "packages/ui/src/components/{{name}}.stories.tsx",
                templateFile: "templates/component/stories.tsx.hbs",
            },
            {
                type: "add",
                path: "packages/ui/src/components/{{name}}.test.tsx",
                templateFile: "templates/component/test.tsx.hbs",
            },
        ],
    });

    plop.setHelper("kebabCase", (text: string) => {
        return text
            .replaceAll(/([a-z])([A-Z])/g, "$1-$2")
            .replaceAll(/\s+/g, "-")
            .toLowerCase();
    });

    plop.setHelper("camelCase", (text: string) => {
        return text
            .replaceAll(/-([a-z])/g, (_, letter) => letter.toUpperCase())
            .replaceAll(/^[A-Z]/g, (letter) => letter.toLowerCase());
    });
}
