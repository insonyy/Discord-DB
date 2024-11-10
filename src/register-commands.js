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
        name: 'create database',
        description: 'Comando para crear la base de datos',
        options: [

            {
                name: "name",
                description: "Nombre de la base de datos",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]
    }
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
