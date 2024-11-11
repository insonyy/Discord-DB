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
                name: "value1",
                description: "Primer parámetro de la consulta",
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
                description: "Desde donde se quiere eliminar",
                type: ApplicationCommandOptionType.Channel,
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
                name: "into",
                description: "Ubicación donde se va a crear la tabla",
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
    {
        name: 'prueba-tema',
        description: 'Comando para sacar el tema del canal',
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
