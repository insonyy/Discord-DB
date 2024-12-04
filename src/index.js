const {Client, IntentsBitField, Collection, ChannelType} = require('discord.js');
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
        case 'mejor-create-table':
            mejorCreateTable(interaction)
            break;

        case 'alter-table':
            alterTable(interaction)
            break;

        case 'use':
            use(interaction)
            break;


    }
});

function version(interaction) {
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
    const where = interaction.options.getString('where');

    if (!fromChannelDelete.isTextBased()) {
        return interaction.reply('Por favor, especifica un canal de texto válido.');
    }

    try {

        const {colms, values} = getColumns(fromChannelDelete);

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


async function update(interaction) {
    const fromChannelUpdate = interaction.options.getChannel('from');
    const param1Update = interaction.options.getString('param1');
    const set1Update = interaction.options.getString('set1');
    const whereUpdate = interaction.options.getString('where');
    const val1Update = interaction.options.getString('val1');

    if (!fromChannelUpdate.isTextBased()) {
        return interaction.reply('Por favor, especifica un canal de texto válido.');
    } else {
        try {

            const {colms, values} = getColumns(fromChannelUpdate);

            const whereIndex = colms.indexOf(whereUpdate);
            const updateIndex = colms.indexOf(param1Update);

            if (whereIndex === -1 || updateIndex === -1) {
                return interaction.reply('Las columnas especificadas no son válidas.');
            }

            //Esto en un futuro me va a dar muchos problemas

            const messages = await fromChannelUpdate.messages.fetch();

            let updatedCount = 0;

            for (const [_, msg] of messages) {
                const msgParts = msg.content.split(';');
                if (msgParts[whereIndex]?.trim() === val1Update) {
                    msgParts[updateIndex] = set1Update;
                    await msg.edit(msgParts.join(';'));
                    updatedCount++;
                }
            }

            if (updatedCount > 0) {
                interaction.reply(`Se actualizaron ${updatedCount} registros en la columna '${param1Update}'.`);
            } else {
                interaction.reply('No se actualizó ningún valor.');
            }

        } catch (error) {
            console.error('Error al insertar el contenido:', error);
            interaction.reply('Hubo un error al intentar insertar los datos.');
        }
    }

}

async function insert(interaction) {

    const intoChannelInsert = interaction.options.getChannel('into');
    const colsInsert = interaction.options.getString('cols')
    const valuesInsert = interaction.options.getString('vals');


    if (!intoChannelInsert.isTextBased()) {
        return interaction.reply('Por favor, especifica un canal de texto válido.');
    } else {
        try {

            const {colms, values} = getColumns(intoChannelInsert);


            const colmsArray = colsInsert.split(',').map(col => col.trim());
            const valsArray = valuesInsert.split(',').map(val => val.trim());

            if (colmsArray.length !== valsArray.length) {
                return interaction.reply(
                    `El número de columnas (${colmsArray.length}) no coincide con el número de valores (${valsArray.length}).`
                );
            } else {
                for (const col of colmsArray) {
                    if (!colms.includes(col)) {
                        return interaction.reply(`La columna '${col}' no existe en la tabla.`);
                    }
                }

                const row = colms.map(col => {
                    const index = colmsArray.indexOf(col);
                    return index !== -1 ? valsArray[index] : '';
                }).join(';');

                await intoChannelInsert.send(row);
                interaction.reply('Datos insertados correctamente.');

            }
        } catch (error) {
            console.error('Error al insertar el contenido:', error);
            interaction.reply('Hubo un error al intentar insertar los mensajes.');
        }
    }
}

async function insertPrueba(interaction) {
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

async function createTable(interaction) {

    const nameTable = interaction.options.getString('table_name');
    const column1 = interaction.options.getString('column1');
    const datatype1 = interaction.options.getString('datatype1');
    const column2 = interaction.options.getString('column2');
    const datatype2 = interaction.options.getString('datatype2');

    if (!selectedDatabase) {
        return interaction.reply('Por favor introduzca una base de datos válida.');
    } else {
        try {
            await interaction.guild.channels.create({
                name: nameTable,
                type: ChannelType.Channel,
                parent: selectedDatabase.id,
                topic: column1 + '(' + datatype1 + ')' + ';' + column2 + '(' + datatype2 + ')'
            });

            await interaction.reply(`La tabla '${nameTable}' ha sido creada con éxito.`);

        } catch (error) {
            console.error('Error al crear la tabla:', error);
            interaction.reply('Hubo un error al intentar crear la tabla.');
        }
    }
}

async function mejorCreateTable(interaction){
    const nameTable = interaction.options.getString('table_name');
    const colmsCreateTable = interaction.options.getString('colms_def');

    if (!selectedDatabase) {
        return interaction.reply('Por favor introduzca una base de datos válida.');
    } else {

        await interaction.deferReply();

        const columns = colmsCreateTable.split(',');

        let topic = '';

        for (let col of columns) {
            const [columnName, dataType] = col.trim().split(' ');
            if (!columnName || !dataType) {
                return interaction.editReply('Definición de columnas inválida. Asegúrate de usar "nombre tipo".');
            }
            topic += `${columnName}(${dataType});`;
        }

        topic = topic.slice(0, -2);

        try{
            await interaction.guild.channels.create({
                name: nameTable,
                type: ChannelType.Channel,
                parent: selectedDatabase.id,
                topic: topic
            });

            await interaction.editReply(`La tabla '${nameTable}' ha sido creada con éxito.`);
        }catch (error){
            console.error('Error al crear la tabla:', error);
            interaction.reply('Hubo un error al intentar crear la tabla.');
        }
    }

}

async function alterTable(interaction) {
    const tableNameAlterT = interaction.options.getChannel('table-name');
    const addColAlterT = interaction.options.getString('add-col');
    const dropColAlterT = interaction.options.getString('drop-col');
    const renameColAlterT = interaction.options.getString('rename-col');
    const alterColAlterT = interaction.options.getString('alter-col');

    if (!tableNameAlterT) {
        return interaction.reply('La base de datos introducida no existe.');
    } else {

        await interaction.deferReply();

        try {

            const {colms, values} = getColumns(tableNameAlterT);

            const messages = await tableNameAlterT.messages.fetch();

            if (addColAlterT) {
                const [colName, colType] = addColAlterT.split('(');
                if (!colType.endsWith(')') || !colType) {
                    return interaction.editReply('El formato de la nueva columna debe ser "nombre(tipo)".');
                }
                if (colms.includes(colName.trim())) {
                    return interaction.editReply('La columna ya existe.');
                }

                colms.push(colName.trim());
                values.push(colType.slice(0, -1).trim());

                let updatedCount = 0;

                for (const [_, msg] of messages) {
                    const msgParts = msg.content.split(';');
                    msgParts.push('null');
                    await msg.edit(msgParts.join(';'));
                    updatedCount++;
                }
                interaction.editReply(`Columna '${colName.trim()}' añadida con éxito.`);
            }

            if (dropColAlterT) {
                const colIndex = colms.indexOf(dropColAlterT);
                if (colIndex === -1) {
                    return interaction.editReply('La columna especificada no existe.');
                }

                colms.splice(colIndex, 1);
                values.splice(colIndex, 1);
                interaction.editReply(`Columna '${dropColAlterT}' eliminada con éxito.`);
            }

            const newTopic = colms
                .map((col, idx) => `${col}(${values[idx]})`)
                .join(';');


            if (newTopic) {
                await tableNameAlterT.setTopic(newTopic);
            }

        } catch (error) {
            console.error('Error al intentar alterar la tabla:', error);
            interaction.editReply('Hubo un error al intentar alterar la tabla.');
        }
    }
}


async function use(interaction) {
    const database = interaction.options.getString('database');

    selectedDatabase = interaction.guild.channels.cache.find(c => c.name === database && c.type === ChannelType.GuildCategory);

    if (!selectedDatabase) {
        return interaction.reply('La base de datos introducida no existe.');
    } else {
        await interaction.reply('Se ha seleccionado la siguiente base de datos: ' + selectedDatabase)
    }
}

function getColumns(tableName) {
    let colms = [];
    let values = [];
    const colmString = tableName.topic;
    const columns = colmString.split(';');


    columns.forEach(column => {
        const match = column.match(/^([^()]+)\(([^)]+)\)$/);
        if (match) {
            colms.push(match[1].trim());
            values.push(match[2].trim());
        }
    });

    return {colms, values};
}


client.login(process.env.TOKEN);


