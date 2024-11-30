require("dotenv").config();
const {REST, Routes, ApplicationCommandOptionType} = require("discord.js");

const commands = [
    {
        name: "version",
        description: "version of the bot",
    },
    {
        name: "select",
        description: "Hacer una consulta a la base de datos",
        options: [
            {
                name: "from",
                description: "Desde donde se quiere hacer la consulta",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
            {
                name: "param1",
                description: "Primer parámetro de la consulta",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "param2",
                description: "Segundo parámetro de la consulta",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "where",
                description: "La condición de la consulta",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ],
    },
    {
        name: "delete",
        description: "Eliminar datos de la base de datos",
        options: [
            {
                name: "from",
                description: "Desde donde se quiere eliminar",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
            {
                name: "param1",
                description: "Primer parámetro de la consulta",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "param2",
                description: "Segundo parámetro de la consulta",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "where",
                description: "La condición de la consulta",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ],
    },
    {
        name: "insert",
        description: "Comando para insertar contenido en la base de datos.",
        options: [
            {
                name: "into",
                description: "Desde donde se quiere insertar",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
            {
                name: "cols",
                description: "Columnas seleccionadas",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "vals",
                description: "Nuevos valores de las columnas seleccionadas",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },
    {
        name: "insert-prueba",
        description: "Comando para insertar contenido en la base de datos.",
        options: [
            {
                name: "into",
                description: "Desde donde se quiere insertar",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
            {
                name: "value1",
                description: "Primer parámetro de la consulta",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "numrep",
                description: "Primer parámetro de la consulta",
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ]
    },
    {
        name: 'update',
        description: 'Comando para editar un dato',
        options: [
            {
                name: "from",
                description: "Desde donde se quiere editar",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },
            {
                name: "param1",
                description: "Parámetro que se va a editar",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "set1",
                description: "Valor nuevo/editado",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "where",
                description: "Parámetro de referencia",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "val1",
                description: "Valor del parámetro de referencia",
                type: ApplicationCommandOptionType.String,
                required: true,
            },

        ]
    },
    {
        name: 'create-database',
        description: 'Comando para crear la base de datos',
        options: [

            {
                name: "name",
                description: "Nombre de la base de datos",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },
    {
        name: 'drop-database',
        description: 'Comando para eliminar la base de datos. COMANDO SENSIBLE.',
        options: [

            {
                name: "name",
                description: "Nombre de la base de datos",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },
    {
        name: 'create-table',
        description: 'Comando para crear una tabla en la base de datos',
        options: [

            {
                name: "table_name",
                description: "Nombre de la base de datos",
                type: ApplicationCommandOptionType.String,
                required: true,
            },

            {
                name: "column1",
                description: "Primer parámetro",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "datatype1",
                description: "Tipo de dato del primer parámetro",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "column2",
                description: "Segundo parámetro",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "datatype2",
                description: "Tipo de dato del segundo parámetro",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ]
    },

    /**
     * Ejemplo:
     * Para añadir una nueva columna -> /alter-table add-col: apellido(varchar255)
     * Para eliminar una columna -> /alter-table drop-col: nombre
     * Para cambiarle el nombre a una columna -> /alter-table rename-col: id new-name: id_alumno
     * Para cambiar el tipo a una columna -> /alter-table alter-type: nombre(varchar15) new-type: (varchar255)
     * */

    {
        name: 'alter-table',
        description: 'Comando para modificar una tabla existente en la base de datos',
        options: [

            {
                name: "table_name",
                description: "Nombre de la base de datos",
                type: ApplicationCommandOptionType.Channel,
                required: true,
            },

            {
                name: "add-col",
                description: "Agregar columnas",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "drop-col",
                description: "Eliminar columnas",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "rename-col",
                description: "Renombrar columna",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "new-name",
                description: "Nuevo nombre de la columna",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "alter-type",
                description: "Modificar el tipo de dato que acepta la columna",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
            {
                name: "new-type",
                description: "Nuevo tipo de la columna",
                type: ApplicationCommandOptionType.String,
                required: false,
            },
        ]
    },

    {
        name: 'use',
        description: 'Seleccionar base de datos a usar.',
        options: [
            {
                name: "database",
                description: "Base de datos que se usará",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    },
];

const rest = new REST({version: "10"}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Registering slash commands...");
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {body: commands}
        );

        console.log("Slash commands were registered successfully!");
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();
