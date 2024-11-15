const { Client, IntentsBitField, Collection, ChannelType } = require('discord.js');
require('dotenv').config();

let selectedDatabase

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

client.on('ready', (c) => {
    console.log(`OK ${c.user.tag} is online`);
    client.user.setActivity(
        {
            name: "ddb"
        })
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    switch (interaction.commandName) {
        case 'version':
            version(interaction)
            break;

        case 'select':
            select(interaction)
            break;

        case 'delete':
            del(interaction)
            break;

        case 'insert':
            insert(interaction)
            break;
        case 'insert-prueba':
            insertPrueba(interaction)
            break;
        case 'update':
            update(interaction)
            break;
        case 'create-database':
            createDatabase(interaction)
            break;
        case 'drop-database':
            dropDatabase(interaction)
            break;
        case 'create-table':
            createTable(interaction)
            break;
        case 'use':
            use(interaction)
            break;


    }
});

function version(interaction){
    interaction.reply('Versión del bot: ' + require('../package.json').version);
}

async function select(interaction) {
    const fromChannelSelect = interaction.options.getChannel('from');
    const param1Select = interaction.options.getString('param1');
    const param2Select = interaction.options.getString('param2');

    if (!fromChannelSelect.isTextBased()) {
        return interaction.reply('Por favor, especifica un canal de texto válido.');
    }

    try {

        const fetchOptions = {
            limit: 100
        }

        let messages = new Collection()
        let lastId = null
        let count = 0

        await interaction.deferReply();

        do {
            if (lastId) fetchOptions.before = lastId
            const response = await fromChannelSelect.messages.fetch(fetchOptions);
            console.log(response.size + ',' + messages.size)
            count = response.size
            messages = messages.concat(response)
            lastId = response.last().id
        } while (count >= 100)

        if (param1Select === '*') {

            console.log('Tamaño de la lista de mensajes: ' + messages.size)

            let msgsToSend = ''

            for (let i = 0; i < messages.size; i++) {
                let currentMsg = messages.at(i).content + '\n'
                msgsToSend += currentMsg

                if (!(i + 1 < messages.size && msgsToSend.length < (2000 - (messages.at(i + 1).content.length + 1)))) {
                    await interaction.channel.send(msgsToSend)
                    msgsToSend = ''
                }
            }

            await interaction.channel.send(`\n -------------------------------------------------------- \n ${messages.size} filas seleccionadas.`)


        } else {
            const filteredMessages = messages.filter(msg =>
                msg.content.includes(param1Select) && (!param2Select || msg.content.includes(param2Select))
            );
            if (filteredMessages.size === 0) {
                interaction.reply('No se encontraron mensajes con esos parámetros.');
            } else {
                const res = filteredMessages.map(msg => `${msg.content}`).join('\n').slice(0, 2000);

                await interaction.editReply('Resultados');
                await interaction.deferReply();
                interaction.editReply(`${res}`);
            }
        }

    } catch (error) {
        console.error('Error al buscar mensajes:', error);
        interaction.reply('Hubo un error al buscar los mensajes.');
    }

}

async function del(interaction) {
    const fromChannelDelete = interaction.options.getChannel('from');
    const param1Delete = interaction.options.getString('param1');
    //const param2Delete = interaction.options.getString('param2');
    const where = interaction.options.getString('where');

    if (!fromChannelDelete.isTextBased()) {
        return interaction.reply('Por favor, especifica un canal de texto válido.');
    }

    try {

        let colms = [];
        //let values = []
        const colmString= fromChannelDelete.topic;
        const columns = colmString.split(';');

        columns.forEach(column =>{
            const match = column.match(/^([^()]+)\(([^)]+)\)$/);
            if (match) {
                colms.push(match[1].trim());
                //values.push(match[2].trim());
            }
        });

        const whereIndex = colms.indexOf(where);

        if (whereIndex === -1) {
            return interaction.reply(`La columna especificada '${where}' no existe en la descripción del canal.`);
        }

        //const targetValue = values[whereIndex];
        //if (targetValue !== param1Delete) {
        //    return interaction.reply(`No se encontraron registros en la columna '${where}' con el valor '${param1Delete}'.`);
        //}

        const messages = await fromChannelDelete.messages.fetch();

        const messagesToDelete = messages.filter(msg =>
            (msg.content.includes(param1Delete))
        );

        if (messagesToDelete.size === 0) {
            console.log('No se encontraron mensajes para eliminar con esos parámetros.');
            return interaction.reply('No se encontraron mensajes para eliminar con esos parámetros.');
        }

        await fromChannelDelete.bulkDelete(messagesToDelete, true);

        interaction.reply(`Se han eliminado ${messagesToDelete.size} mensajes del canal ${fromChannelDelete.name}.`);
        console.log(`Se han eliminado ${messagesToDelete.size} mensajes del canal ${fromChannelDelete.name}.`);

    } catch (error) {
        console.error('Error al eliminar mensajes:', error);
        interaction.reply('Hubo un error al intentar eliminar los mensajes.');
    }
}



async function update(interaction){

}

async function insert(interaction) {
    const intoChannelInsert = interaction.options.getChannel('into');
    const value1Insert = interaction.options.getString('value1');
    const value2Insert = interaction.options.getString('value2');
    const value3Insert = interaction.options.getString('value3');
    const value4Insert = interaction.options.getString('value4');
    const value5Insert = interaction.options.getString('value5');

    if (!intoChannelInsert.isTextBased()) {
        return interaction.reply('Por favor, especifica un canal de texto válido.');
    } else {
        try {

            let colms = [];
            let values = []
            const colmString= intoChannelInsert.topic;
            const columns = colmString.split(';');

            columns.forEach(column =>{
                    const match = column.match(/^([^()]+)\(([^)]+)\)$/);
                if (match) {
                    colms.push(match[1].trim());
                    values.push(match[2].trim());
                }
            });

            console.log(intoChannelInsert.topic)
            console.log(`Número de columnas: ${colms.length}`);
            console.log(`Columnas: ${colms}`);
            console.log(`Valores: ${values}`);

            //Comprobar el tipo de dato introducido lo meteré más adelante
            //También de alguna forma cortar hasta qué valor tiene metido y así no meter nulos en la base de datos

            const res = value1Insert + ';' + (value2Insert || '')

            await intoChannelInsert.send(res);
            interaction.reply('Dato insertado');

        } catch (error) {
            console.error('Error al insertar el contenido:', error);
            interaction.reply('Hubo un error al intentar insertar los datos.');
        }
    }
}

async function insertPrueba(interaction){
    const intoChannelInsertP = interaction.options.getChannel('into');
    const value1InsertP = interaction.options.getString('value1');
    const numrepInsertP = interaction.options.getNumber('numrep');

    if (!intoChannelInsertP.isTextBased()) {
        return interaction.reply('Por favor, especifica un canal de texto válido.');
    } else {
        try {
            if (!intoChannelInsertP.isTextBased()) {
                return interaction.reply('Por favor, especifica un canal de texto válido.');
            } else {
                try {

                    await interaction.deferReply();

                    for (let i = 0; i < numrepInsertP; i++) {

                        await intoChannelInsertP.send(`${value1InsertP}`);
                    }

                    await interaction.editReply('Mensaje insertado');

                } catch (error) {
                    console.error('Error al insertar el contenido:', error);
                    interaction.reply('Hubo un error al intentar insertar los mensajes.');
                }
            }


        } catch (error) {
            console.error('Error al insertar el contenido:', error);
            interaction.reply('Hubo un error al intentar insertar los mensajes.');
        }
    }
}

async function createDatabase(interaction) {
    const nameDatabase = interaction.options.getString('name');

    if (!nameDatabase) return interaction.reply('El nombre introducido no es un nombre válido para la base de datos.')

    try {
        await interaction.guild.channels.create({
            name: nameDatabase,
            type: ChannelType.GuildCategory
        });

        await interaction.reply(`La base de datos '${nameDatabase}' ha sido creada con éxito.`);

    } catch (error) {
        console.error('Error al crear la base de datos:', error);
        interaction.reply('Hubo un error al intentar crear la base de datos.');
    }

}

async function dropDatabase(interaction) {
    const nameDatabase = interaction.options.getString('name');

    if (!nameDatabase) return interaction.reply('El nombre introducido no es un nombre válido para la base de datos.')

    try {

        const category = interaction.guild.channels.cache.find(
            (channel) => channel.name === nameDatabase && channel.type === ChannelType.GuildCategory
        );

        if (!category) {
            return interaction.reply('No se encontró una categoría con el nombre proporcionado.');
        }

        await category.delete();
        interaction.reply(`La base de datos '${nameDatabase}' ha sido eliminada con éxito.`);


    } catch (error) {
        console.error('Error al eliminar la base de datos:', error);
        interaction.reply('Hubo un error al intentar eliminar la base de datos.');
    }

}

async function createTable(interaction){

    const nameTable = interaction.options.getString('table_name');
    const column1 = interaction.options.getString('column1');
    const datatype1 = interaction.options.getString('datatype1');
    const column2 = interaction.options.getString('column2');
    const datatype2 = interaction.options.getString('datatype2');

    if (!selectedDatabase){
        return interaction.reply('Por favor introduzca una base de datos válida.');
    } else{
        try{
            await interaction.guild.channels.create({
                name: nameTable,
                type: ChannelType.Channel,
                parent: selectedDatabase.id,
                topic: column1 + '(' + datatype1 + ')' + ';' + column2 + '(' + datatype2 +')'
            });

            await interaction.reply(`La tabla '${nameTable}' ha sido creada con éxito.`);

        }catch (error){
            console.error('Error al crear la tabla:', error);
            interaction.reply('Hubo un error al intentar crear la tabla.');
        }
    }
}

async function use(interaction){
    const database = interaction.options.getString('database');

    selectedDatabase  = interaction.guild.channels.cache.find(c => c.name === database && c.type === ChannelType.GuildCategory);

    if (!selectedDatabase){
        return interaction.reply('La base de datos introducida no existe.');
    } else {
        await interaction.reply('Se ha seleccionado la siguiente base de datos: ' + selectedDatabase)
    }
}

client.login(process.env.TOKEN);


