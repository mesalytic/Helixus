const {
    stripIndents
} = require("common-tags");

module.exports = {
    code: 'fr',
    COMMANDS: {
        AUTOROLE: {
            description: 'Vous permets de configurer un rôle qui sera attribué aux nouveaux membres.',
            OFF: {
                noRoleConfigured: '[❌] - Aucun rôle n\'a été configuré.',
                removed: '[✅] - Le rôle ne sera plus attribué aux nouveaux membres.'
            },
            added: (role) => `[✅] - Le rôle ${role} sera désormais attribué aux nouveaux membres.`,
            notFound: '[❌] - Le rôle n\'a pas été trouvé.'
        },
        BACKGROUND: {
            description: 'Vous permets de configurer le fond de votre carte de niveaux, de les acheter et de voir la liste complète!',
            BUY: {
                noBackgroundSpecified: '[❌] - Veuillez indiquer un fond a acheter! Pour voir la liste des fonds disponibles, faites `am!background list`!',
                invalidBackground: '[❌] - Veuillez indiquer un fond valide! Pour voir la liste des fonds disponibles, faites `am!background list`!',
                notEnoughCoins: '[❌] Vous n\'avez pas **5000** coins! Revenez une fois cette somme obtenue...',
                alreadyBought: '[❌] - Vous possedez déjà ce fond!',
                success: (background) => `[✅] - Vous avez acheté le fond **${background}** !`
            },
            SET: {
                noBackgrounds: '[❌] - Vous n\'avez aucun fond...',
                noBackgroundSpecified: '[❌] - Veuillez indiquer un fond a configurer! Pour voir la liste des fonds disponibles, faites `am!background list`!',
                invalidBackground: '[❌] - Veuillez indiquer un fond valide! Pour voir la liste des fonds disponibles, faites `am!background list`!',
                success: (background) => `[✅] - Vous avez mis le fond **${background}** !`
            },
            LIST: {
                pleaseWait: "Veuillez patienter...",
                closedPaginator: "❌ Pagination fermée... ❌",
                embedAuthor: "Liste des fonds",
                embedTitle: `Le signe ❌ signifie que vous ne possédez pas le fond.\nAchetez le en faisant \`am!background buy <fond>\` !`
            }
        },
        BALANCE: {
            description: "Affiche votre porte monnaie!",
            output: (bal) => `Vous avez <a:coin:784930553748520961> **${bal}** pièces!`
        },
        BEAUTIFUL: {
            description: 'Tu vois ça? C\'est beau..',
            pleaseWait: '[<a:loading:543460555113889792>] - Veuillez patienter...'
        },
        BEG: {
            description: "Supplie pour des pièces!",
            notReady: (time) => `Tu as déjà supplié pour des pièces récemment! Reviens dans ${time.hours}:${time.minutes}:${time.seconds} !`,
            success: (amount) => `Tu as supplié et a reçu ${amount} pièces!`
        },
        BLUR: {
            description: 'Floute l\'image.',
            pleaseWait: '[<a:loading:543460555113889792>] - Veuillez patienter...'
        },
        BOBROSS: {
            description: 'Deviens une oeuvre d\'art de Bob Ross.',
            pleaseWait: '[<a:loading:543460555113889792>] - Veuillez patienter...'
        },
        BRAZZERS: {
            description: 'Tu fais maintenant parti d\'un film Brazzers.',
            pleaseWait: '[<a:loading:543460555113889792>] - Veuillez patienter...'
        },
        CHOOSE: {
            description: 'Permets au bot de choisir parmi plusieurs choix.',
            success: (choice) => `[✅] - Mon choix est... **${choice}**!`
        },
        COIN: {
            description: 'Pile ou face?',
            success: (side) => `[✅] - C'est atteri sur **${side}**!`
        },
        CONNECT4: {
            description: 'Jouez au Puissance 4 avec des amis ou avec le bot!',
            noMention: '[❌] - Veuillez mentionner quelqu\'un. Pour jouer avec le bot, mentionnez le bot.',
            noColor: (colorList) => `[❌] - Veuillez choisir une couleur: ${colorList}`,
            conj: "et",
            againstYourself: "[❌] - Vous ne pouvez pas jouer avec vous même.",
            currentGame: `[❌] - Une partie est actuellement en cours dans ce salon. Veuillez attendre que le jeu est fini ou allez dans un autre salon.`,
            askingOpponent: (opponent, author) => `[<a:loading:543460555113889792>] - ${opponent}, voulez vous jouer au puissance 4 avec ${author}?`,
            denied: '[❌] - Partie refusée...',
            colors: (opponent, list) => `${opponent}, quelle couleur voulez vous? Choisissez dans cette liste: ${list}`,
            none: "Aucun",
            chooseColumn: (user, lastMove, board, nums) => stripIndents `
            ${user}, veuillez choisir une colonne. Vous pouvez ecrire \`stop\` pour vous rendre.
            Tour précédent : Colonne **${lastMove}**

            ${board}
            ${nums}
            `,
            timesUp: '[❌] - Temps du tour écoulé!',
            inactivity: '[❌] - Le jeu s\'est terminé pour inactivité.',
            finalMove: "Tour final: Colonne",
            winString: (winner) => `[✅] - Félicitations ${winner} !`,
            drawString: '[❌] - Et c\'est une égalité...'
        },
        DAILY: {
            description: "Vous donne des pièces tous les jours",
            notReady: (time) => `Vous avez déjà collecté votre récompense journalière! Revenez dans ${time.hours}:${time.minutes}:${time.seconds} !`,
            success: (amount) => `Vous avez récupéré votre récompense journalière de ${amount} pièces !`
        },
        DICE: {
            description: 'Lance un dé et retourne un nombre entre 1 et le nombre de votre choix.',
            success: (number) => `[✅] - Vous avez eu **${number}**!`
        },
        FISH: {
            description: "Allons pêcher",
            INVENTORY: {
                inventory: "Inventaire de poissons",
                content: (junkFish, commonFish, uncommonFish, rareFish) => `🔧 - Dechets: **${junkFish}**\n🐟 - Communs: **${commonFish}**\n🐠 - Non communs: **${uncommonFish}**\n🐡 - Rare: **${rareFish}**\n`
            },
            SELL: {
                sellWhat: "What would you like to sell?",
                content: (junkFish, commonFish, uncommonFish, rareFish) => `🔧 - Dechets: **${junkFish}**\n🐟 - Communs: **${commonFish}**\n🐠 - Non communs: **${uncommonFish}**\n🐡 - Rare: **${rareFish}**\n`,
                pleaseWait: '[<a:loading:543460555113889792>] - Veuillez patienter...',
                sold: "Poisson vendus",
                soldContent: (fishAmount, fishSymbol, coins) => `Tu as vendu **${fishAmount} ${fishSymbol}** pour __**${coins} pièces**__!`,
                failed: (fishSymbol) => `Tu n'as pas de ${fishSymbol} a vendre...`,
                cancelled: `Tu n'as rien vendu...`
            },
            notEnoughCoins: '[❌] - Tu dois avoir au moins 10 pièces avant de commencer a pêcher.',
            caught: (fishSymbol) => `[✅] - Tu as attrapé... ${fishSymbol} ! (**-10 <a:coin:784930553748520961>**)`
        },
        HELP: {
            TYPES: {
                administration: "Administration",
                economy: "Economie",
                fun: "Fun",
                general: "Général",
                info: "Infos",
                levels: "Niveaux",
                music: "Musique",
                images: "Images"
            },
            description: `Affiche la liste des commandes, triées par catégorie et par alphabet.\nEn spécifiant une commande, vous aurez plus d'informations sur celle ci.`,
            helpEmbedTitle: (command) => `Commande: \`${command.name}\``,
            helpEmbedUsage: 'Utilisation',
            helpEmbedType: 'Catégorie',
            helpEmbedAliases: 'Aliases',
            helpEmbedExamples: 'Exemples',
            helpEmbedNotes: 'Notes',
            embedTitle: 'Commandes d\'Helixus',
            embedDescription: (prefix) => `**Pour plus d'informations:** \`${prefix}help [command]\``
        },
        IGNORE: {
            description: "Vous permets de configurer dans quels salons les commandes pourront être exécutées",
            noChanSpecified: "[❌] - Vous n'avez spécifié aucun salon.",
            noRowsIgnored: (chan) => `[✅] - Le bot ne répondra plus aux commandes dans le salon ${chan}.`,
            notIgnored: (chan) => `[✅] - Le bot répondra de nouveau aux commandes dans le salon ${chan}.`,
            ignored: (chan) => `[✅] - Le bot ne répondra plus de nouveau aux commandes dans le salon ${chan}.`
        },
        JOINMESSAGE: {
            description: "Vous permets de configurer un message qui sera affiché dès l'arrivée d'un membre.",
            notes: 'Voici la liste des tags que vous pouvez utiliser:\n\n{user} - mentionne le membre\n{username} - affiche le pseudo du membre\n{server} - affiche le nom du serveur\n\nVous pouvez indiquer des rôles ainsi que des emotes comme vous le feriez dans un message classique.',
            ON: {
                enabled: `[✅] - Les messages de join ont été activés. Si ce n'est pas déjà fait, faites \`am!help joinmessage\` pour voir comment configurer le message de join.`
            },
            OFF: {
                notEnabled: '[❌] - Les messages de join sont déjà désactivés.',
                disabled: `[✅] - Les messages de join ont été désactivés.`
            },
            CHANNEL: {
                noChanSpecified: '[❌] - Veuillez indiquer un ID, un nom ou une mention de salon!',
                noValidChan: '[❌] - Le salon que vous avez indiqué n\'est pas valide.',
                notEnabled: '[❌] - Les messages de join ne sont pas désactivés.',
                success: (chan) => `[✅] - Les messages de join seront envoyés dans ${chan}.`
            },
            noContent: '[❌] - Vous n\'avez indiqué aucun contenu pour le message de join. Faites `am!help joinmessage` pour voir quels tags vous pouvez utiliser.',
            notEnabled: '[❌] - Les messages de join sont désactivés.',
            success: `[✅] - Le message de join a bien été configuré.`
        },
        LANG: {
            description: 'Change la langue du bot sur le serveur.',
            success: `[✅] - La langue du bot sur ce serveur a bien été mis en **Français** !`
        },
        LEAVEMESSAGE: {
            description: "Vous permets de configurer un message qui sera affiché dès le départ d'un membre.",
            notes: 'Voici la liste des tags que vous pouvez utiliser:\n\n{username} - affiche le pseudo du membre\n{server} - affiche le nom du serveur\n\nVous pouvez mentionner des rôles ou des emotes comme vous le feriez sur un message classique.',
            ON: {
                enabled: `[✅] - Les messages de leaves ont été activés. Si ce n'est pas déjà fait, faites \`am!help leavemessage\` pour voir comment configurer le message de leave.`
            },
            OFF: {
                notEnabled: '[❌] - Les messages de leaves sont déjà activés.',
                disabled: `[✅] - Les messages de leaves ont été désactivés.`
            },
            CHANNEL: {
                noChanSpecified: '[❌] - Veuillez indiquer un ID, un nom ou une mention de salon!',
                noValidChan: '[❌] - Le salon que vous avez indiqué n\'est pas valide.',
                notEnabled: '[❌] - Les messages de leaves ne sont pas désactivés.',
                success: (chan) => `[✅] - Les messages de leaves seront envoyés dans ${chan}.`
            },
            noContent: '[❌] - Vous n\'avez indiqué aucun contenu pour le message de leave. Faites `am!help leavemessage` pour voir quels tags vous pouvez utiliser.',
            notEnabled: '[❌] - Les messages de leave sont désactivés.',
            success: `[✅] - Le message de leave a bien été configuré.`
        },
        LEVELUP: {
            description: 'Vous permet de configurer le message de level up, ainsi que le salon auquel ce message sera envoyé.',
            notes: '__**Paramètres "Channel"**__:\nSi vous voulez que le message de levelup soit envoyé dans le même salon, mettez msgChannel comme argument. `msgChannel`.\n\n__**Paramètres "Message"**__:\nVoici la liste des tags que vous pouvez utiliser:\n{user} - mentionne l\'utilisateur\n{username} - affiche le pseudo du membre\n{server} - affiche le nom du serveur\n{level} - affiche le niveau obtenu',
            CHANNEL: {
                noChanSpecified: '[❌] - Veuillez indiquer un ID, un nom ou une mention de salon!',
                invalidChan: '[❌] - Ce salon n\'existe pas.',
                levelNotEnabled: '[❌] - Le système de niveau n\'est pas activé sur votre serveur. Voir `am!help toggle`.',
                success: (chan) => `[✅] - Les messages de level up seront maintenant envoyés dans ${chan}!`
            },
            MESSAGE: {
                noContent: '[❌] - Vous n\'avez spécifié aucun contenu pour le message de level up. Afin de voir les tags que vous pouvez utiliser au sein de votre message, faites `am!help levelup`.',
                levelNotEnabled: '[❌] - Le système de niveau n\'est pas activé sur votre serveur. Voir `am!help toggle`.',
                success: `[✅] - Le message de levelup a été changé !`
            }
        },
        LOGS: {
            description: 'Vous permets de configurer le système de logs.',
            ON: {
                alreadyEnabled: '[❌] - Les logs sont déja activés sur ce serveur !',
                enabled: `✅ - Les logs sont désormais activés sur ce serveur!`
            },
            CHANNEL: {
                noChanSpecified: '[❌] - Veuillez indiquer un ID, un nom ou une mention de salon!',
                notEnabled: '[❌] - Les logs ne sont pas activés.',
                success: (channel) => `✅ - Les logs seront désormais envoyés dans ${channel}`
            },
            IGNORE: {
                noChanSpecified: '[❌] - Veuillez indiquer un ID, un nom ou une mention de salon!',
                ignored: '[✅] - Le channel sera désormais ignoré pour les évenements de logs.',
                notIgnored: '[✅] - Le channel ne sera désormais plus ignoré pour les évenements de logs.'
            },
            TOGGLE: {
                notValidEvent: (logsEventList) => `[❌] - Veuillez indiquer un évenement valide.\nListe des évenements valides: \`${logsEventList}\``,
                notEnabled: `[❌] - Les logs ne sont pas activés sur ce serveur.`,
                eventEnabled: '[✅] - Cet evénement sera désormais log sur ce serveur.',
                eventDisabled: '[✅] - Cet evénement ne sera plus log sur ce serveur.'
            },
            noChanSpecified: '[❌] - Veuillez indiquer un ID, un nom ou une mention de salon!',
        },
        LOOP: {
            description: 'Met en boucle la file de musique',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            success: (loopStatus) => `✅ - La boucle est maintenant ${loopStatus === true ? "**activée**" : "**désactivée**"}!`
        },
        LYRICS: {
            description: 'Affiche les paroles de la musique souhaitée via l\'API KSoft.si',
            noQuery: '[❌] - Veuillez indiquer une musique a chercher.',
            embedTitle: (title, artist) => `Paroles de ${title} par ${artist}`,
            embedFooter: "Service livré par api.ksoft.si"
        },
        MEME: {
            description: 'Affiche un meme aléatoire venant de Reddit.',
            loading: "[<a:loading:543460555113889792>] - Veuillez patienter..."
        },
        NOWPLAYING: {
            description: 'Affiche la musique actuellement jouée.',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            embedAuthor: (title) => `Joue: ${title}`,
            embedFooter: (time) => `Temps restant: ${time}`
        },
        PAUSE: {
            description: 'Met en pause la musique qui est actuellement jouée',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            success: (author) => `⏸ ${author} a mis en pause la musique.`
        },
        PAY: {
            description: "Donner des pièces a quelqu'un.",
            notes: 'Pour chaque transaction effectuée, une taxe de 5% sera déduite. Veuillez prendre ceci en compte lors de vos transactions.',
            noUser: '[❌] - Vous devez mentionner quelqu\'un!',
            isBot: '[❌] - Vous ne pouvez pas envoyer de pièces a un bot.',
            notEnoughCoins: '[❌] - Vous n\'avez pas suffisamment de pièces!',
            noCoinsSpecified: '[❌] - Vous devez specifier un nombre de pièces.',
            pending: (oldAmt, newAmt, user) => `[<a:loading:543460555113889792>] - Voulez vous vraiment envoyer ~~${oldAmt}~~ (_5% de taxe_) **${newAmt} pièces** à ${user} ?`,
            success: (amount, user) => `[✅] - Vous avez envoyé **${amount} pièces** à ${user}!`,
            cancelled: `[❌] - La transaction a été annulée.`
        },
        PING: {
            description: 'Affiche la **latence de message** ainsi que le **heartbeat** du bot.',
            latency: "Latence",
        },
        PLAY: {
            description: "Vous permets de jouer de la musique venant de YouTube ou SoundCloud",
            noVoiceChannel: "[❌] - Vous devez être dans un salon vocal!",
            notSameVoiceChannel: "[❌] - Vous devez être dans le même salon vocal que le bot.",
            embedAuthor: "Selection de musique",
            addedToQueue: (song, author) => `✅ - **${song}** a été ajouté par ${author}`,
            error: (error) => `[❌] - Impossible de rejoindre le salon vocal: ${error}`,
            ended: "🚫 File terminée.",
            startedPlaying: (title, url) => `🎶 Joue: **${title}** <${url}>`
        },
        PREFIX: {
            description: 'Change le préfixe du bot sur le serveur.',
            actualPrefix: (prefix) => `Le préfixe actuel est: \`${prefix}\``,
            tooLong: `[❌] - Le préfixe doit faire moins de 5 caractères.`,
            success: (prefix) => `[✅] - Le préfixe pour ce serveur est maintenant \`${prefix}\`.`
        },
        QUEUE: {
            description: 'Affiche la file. Utilisez les réactions pour naviguer entre les pages.',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            embedTitle: "File\n",
            embedDescription: (title, url, info) => `**Joue - [${title}](${url})**\n\n${info}`
        },
        RANK: {
            description: 'Affiche votre niveau.',
        },
        REACTIONROLE: {
            description: 'Vous permet de configurer des Reaction Roles.\nSi un membre ajoute une réaction qui est liée a un role, ce rôle lui sera attribué.',
            noChanSpecified: "[❌] - Vous n'avez spécifié aucun salon.",
            noValidChan: '[❌] - Le salon spécifié n\'est pas valide.',
            noMessageID: `[❌] - Vous n'avez pas spécifié d'ID de message.`,
            noEmoteSpecified: `[❌] - Vous n'avez pas spécifié d'emoji.`,
            noValidEmote: `[❌] - L'emoji spécifié n'est pas valide.`,
            noRole: `[❌] - Le rôle spécifié n'est pas valide ou non existant.`,
            emoteAlreadyUsed: '[❌] - Cet emoji est déjà lié a un Reaction Role pour ce message.',
            roleAlreadyUsed: '[❌] - Ce rôle est déjà lié a un Reaction Role pour ce message.',
            success: (emote) => `[✅] - Ce rôle sera désormais donné quand quelqu'un ajoutera l'emoji ${emote} sur le message.`,
            REMOVE: {
                success: `[✅] - Le Reaction Role a bien été supprimé.`,
                notFound: `[❌] - Le Reaction Role n'a pas été trouvé.`
            }
        },
        RESUME: {
            description: 'Relance la musique si elle est en pause.',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            success: (author) => `▶ ${author} a relancé la musique.`
        },
        REVERSE: {
            description: 'Inverse le texte spécifié.',
        },
        REWARDS: {
            description: 'Vous permets de configurer des récompenses de rôles en fonction du niveau.',
            ADD: {
                noLevelSpecified: '[❌] - Veuillez indiquer un niveau pour la récompense.',
                noRoleSpecified: '[❌] - Veuillez indiquer un rôle pour la récompense.',
                levelAlreadyUsed: '[❌] - Ce niveau est déjà utilisé pour une autre récompense !',
                roleAlreadyUsed: '[❌] - Ce rôle est déjà utilisé pour une autre récompense!',
                success: (role, level) => `[✅] - Le rôle ${role} sera dorénavant donné aux membres passant le niveau **${level}**!`
            },
            REMOVE: {
                noLevelSpecified: '[❌] - Veuillez indiquer un niveau pour la récompense.',
                success: (role, level) => `[✅] - Le rôle ${role} ne sera plus donné aux membres passant le niveau **${level}**!`,
                notFound: (level) => `[❌] - Aucune récompense a été trouvée pour le niveau **${level}**.`
            },
            SHOW: {
                pleaseWait: "Veuillez patienter...",
                closedPaginator: "Paginateur fermé..",
                embedTitle: (page, pages) => `Liste des récompenses de niveau (${page + 1}/${pages + 1})`
            }
        },
        RPS: {
            description: 'Joue au Pierre Feuille Ciseaux contre le bot!',
            whatChoice: "Quel est ton choix?",
            choiceList: '✊ - Pierre\n📄 - Feuille\n✂️ - Ciseaux',
            loading: '[<a:loading:543460555113889792>] - Veuillez patienter...',
            tie: "C'est une égalité!",
            botWin: "J'ai gagné!",
            userWin: "Tu as gagné",
            choices: (userChoice, botChoice) => `Tu as choisi: ${userChoice}\nJ'ai choisi: ${botChoice}`
        },
        SAY: {
            description: 'Repète la phrase spécifiée.',
            tooLong: '[❌] - Veuillez spécifier une phrase faisant moins de 1950 caractères.'
        },
        SEEK: {
            description: 'Vous permets d\'aller a un point spécifique de la musique.',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            notThatLong: "[❌] - La musique n'est pas aussi longue...",
            success: (duration) => `✅ - La musique est maintenant à **${duration}**!`
        },
        SELECT: {
            description: 'Selectionne quelqu\'un aléatoirement sur le serveur.',
            noSubject: (randomMember) => `[✅] - Le membre selectionné est... ${randomMember}.`,
            subject: (subject, randomMember) => `[✅] - Le membre selectionné pour **${subject}** est... ${randomMember}.`
        },
        SERVERINFO: {
            description: "Affiche des informations à propos du serveur.",
            owner: "👑 | Propriétaire",
            members: "👥 | Membres",
            serverID: "🔑 | ID du serveur",
            language: "📙 | Langue",
            region: "🚩 | Région",
            channelCount: "🗨️ | Nombre de salons",
            channelCountValue: (channelsSize) => `**${channelsSize}** salons`,
            emojiCount: "👀 | Nombre d'emojis",
            emojiCountValue: (emojisSize) => `**${emojisSize}** emojis`,
            createdOn: "⏱️ | Créé le",
            joinedOn: "🔗 | Rejoins le",
            verificationLevel: "🚥 | Niveau de vérification",
            mfaLevel: "🔒 | Niveau de l'Authentification a Double Facteurs",
            boostsCount: "🚀 | Nombre de boosts",
            boostLevel: "🚀 | Niveau de boost",
            verifiedServer: "<:verified:786313097857335376> | Serveur vérifié",
            verified: "Verifié",
            notVerified: "Non Verifié",
            partner: "<:partnerowner:776628269356417036> | Serveur Partenaire",
            partnered: "Partenaire",
            notPartnered: "Non Partenaire",
            moreRole: (rolesLeft) => `et ${rolesLeft} autres rôles.`,
            moreEmotes: (emotesLeft) => `et ${emotesLeft} autres emotes.`
        },
        SKIP: {
            description: 'Passe la musique actuelle.',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            success: `✅ - La musique a bien été passée!`
        },
        STATS: {
            description: 'Affiche les statistiques a propos du bot.',
            license: "Ce bot est sous la license Open-Source MIT, pour plus d'informations, visionnez la license entière **[ici](https://github.com/chocololat/Helixus/blob/master/LICENSE)**",
            developer: "• __Developpeur__",
            statistics: "• __Statistiques__",
            statisticsValue: (guildsCache, usersCache, channelsSize) => `**Serveurs**: ${guildsCache}\n**Utilisateurs**: ${usersCache}\n**Salons**: ${channelsSize}`,
            using: "• __Utilise__",
            uptime: "• __En ligne depuis__",
            ram: "• __RAM__",
            cpu: (percent) => `• __CPU (${percent.toFixed(2)}%)__`,
            links: "• __Liens__",
            supportServer: "Serveur de support",
            invitationLink: "Lien d'invitation",
            website: "Site Internet (en developpement)"
        },
        STOP: {
            description: 'Stoppe la musique et enlève la file.',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            success: (author) => `⏹ ${author} a stoppé la musique!`
        },
        THREEKYEARS: {
            description: 'Ajoute la photo de votre choix sur le meme Pokémon `It\'s been 3000 years...`',
            pleaseWait: '[<a:loading:543460555113889792>] - Veuillez patienter...'
        },
        TOGGLE: {
            description: 'Active ou désactive le système de niveaux',
            OFF: {
                alreadyDisabled: '[❌] - Le système de niveau est déjà **désactivé**!',
                success: '[✅] - Le système de niveau a bien été **désactivé** !'
            },
            ON: {
                success: '[✅] - Le système de niveau a bien été **activé** !',
                alreadyEnabled: '[❌] - Le système de niveau est déjà **activé**!'
            }
        },
        TOP: {
            description: 'Affiche le classement des niveaux sur le serveur',
            pleaseWait: "Veuillez patienter...",
            fullTop: (fullTop) => `Voici le classement en entier: ${fullTop}`,
            closedPaginator: "Ce paginateur est fermé..",
            embedAuthor: (guildName) => `${guildName} - Classement Niveaux`,
            embedFooter: "Utilise les réactions pour intéragir avec le message!"
        },
        TRANSLATE: {
            description: 'Permets de traduire du texte.',
            embedAuthor: "Traduction",
            embedTranslatedFrom: (translatedFrom) => `Traduit de ${translatedFrom}`,
            embedTranslatedTo: (target) => `vers ${target}`
        },
        USERINFO: {
            description: "Affiche des informations a propos d'un utilisateur __**étant sur le serveur**__.",
            username: "Nom d'utilisateur",
            bot: "Bot",
            user: "Utilisateur",
            none: "Aucun",
            currentStatus: "Statut",
            accountCreated: "Compte créé le",
            accountCreatedAgo: (time) => `Il y a ${time.replace("days", "jours")}`,
            joined: "Rejoins le",
            joinedAgo: (time) => `Il y a ${time.replace("days", "jours")}`,
            currentlyActiveOn: "Connecté sur",
            offline: "Hors-Ligne",
            nitroBoostStatus: "Statut Nitro Boost",
            nitroBoostStatusAgo: (time) => `Il y a ${time.replace("days", "jours")}`,
            noNitroBoostStatus: "Aucun Nitro Boost d'actif",
            moreRoles: (rolesSize) => `et ${rolesSize} autres rôles.`
        },
        VOLUME: {
            description: 'Change le volume de la musique actuelle.',
            noQueue: "[❌] - Aucune musique n'est jouée.",
            volume: (volume) => `🔊 - Le volume est à **${volume}%**.`,
            success: (volume) => `✅ - Le volume est maintenant à **${volume}%**!`
        },
        WEEKLY: {
            description: "Vous donne des pièces toutes les semaines!",
            notReady: (time) => `Vous avez déjà collecté votre récompense hebdomadaire! Revenez dans ${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s !`,
            success: (amount) => `Vous avez récupéré votre récompense hebdomadaire de ${amount} pièces !`
        },
    },
    EVENTS: {
        CHANNELCREATE: {
            unknownUser: 'Membre Inconnu',
            created: (type, channel) => `${type === "Catégorie" ? "Une": "Un"} **${type}** a été créé. (**${channel.name}** [<#${channel.id}>])`,
            createdBy: "Créé par",
            channelID: "ID du salon",
            permissionsOverwrite: (role) => `Permissions:\n${role.name}`,
            permissions: (allowed, denied) => `Type: role\nPermissions autorisées: ${allowed}\nPermissions refusées: ${denied}`,
            none: "Aucun",
        },
        CHANNELDELETE: {
            unknownUser: 'Membre Inconnu',
            deleted: (type, channel) => `${type === "Catégorie" ? "Une": "Un"} **${type}** a été supprimé. (**${channel.name}**)`,
            deletedBy: "Supprimé par",
            channelID: "ID du Salon",
        },
        CHANNELUPDATE: {
            changedName: (newChannel) => `**Le nom de ${newChannel} a été changé.**`,
            changedTopic: (newChannel) => `**Le sujet de ${newChannel} a été changé.**`,
            changedPermissions: (newChannel) => `Les permissions de **${newChannel} ont été changées.**\n*note:* cliquez [ici](https://discordapp.com/developers/docs/topics/permissions) pour savoir ce que ces chiffres signifient`,
            old: "Ancien:",
            new: "Nouveau:",
            none: "Aucun",
            allowed: (oldPerms, newPerms) => `Permissions autorisées: \`${oldPerms}\` -> \`${newPerms}\`\n`,
            denied: (oldPerms, newPerms) => `Permissions refusées: \`${oldPerms}\` -> \`${newPerms}\`\n`,
            deleted: 'Permissions supprimées'
        },
        EMOJICREATE: {
            unknownUser: 'Membre Inconnu',
            created: (emoji) => `Nouvel emoji créé (**${emoji.name}** [\`<:${emoji.name}:${emoji.id}>\`])`,
            createdBy: "Créé Par",
            emojiID: "ID de l'Emoji",
        },
        EMOJIDELETE: {
            unknownUser: 'Membre Inconnu',
            deleted: (emoji) => `Emoji supprimé (**${emoji.name}**)`,
            deletedBy: "Supprimé Par",
            emojiID: "ID de l'Emoji",
        },
        EMOJIUPDATE: {
            unknownUser: 'Membre Inconnu',
            updated: (emoji) => `Emoji mis a jour (**${emoji.name}** [\`<:${emoji.name}:${emoji.id}>\`])`,
            updatedBy: "Mis a jour par",
            oldName: "Ancien Nom",
            newName: "Nouveau Nom",
            emojiID: "ID de l'Emoji",
        },
        GUILDBANADD: {
            banned: (user) => `${user.username}#${user.discriminator} a été banni.`,
            userInfos: "Informations sur le membre",
            isBot: "\nEst un bot",
            reason: "Raison",
            none: "Aucune",
            bannedBy: "Banni par",
            unknownUser: 'Membre Inconnu',
        },
        GUILDBANREMOVE: {
            unbanned: (user) => `${user.username}#${user.discriminator} a été débanni.`,
            userInfos: "Informations sur le membre",
            isBot: "\nEst un bot",
            reason: "Raison",
            none: "Aucune",
            unbannedBy: "Débanni par",
            unknownUser: 'Membre Inconnu',
        },
        GUILDMEMBERADD: {
            joined: (member, memberCount) => `${member} a rejoins! Nous sommes maintenant **${memberCount}** membres !`,
            joinedAt: "Rejoins le",
            accountAge: "Le compte à",
            days: (days) => `**${days}** jours`,
            userID: "ID du Membre",
        },
        GUILDMEMBERREMOVE: {
            unknown: "Inconnu",
            none: "Aucun",
            lurker: "Fouineur...",
            lurkerLeft: `Un fouineur a quitté le serveur...`,
            kicked: (member) => `${member.user.username}#${member.user.discriminator} a été exclu.`,
            left: (member) => `${member.user.username}#${member.user.discriminator} a quitté le serveur.`,
            userInfos: "Infos sur le membre",
            isBot: "\nEst un bot",
            reason: "Raison",
        },
        GUILDMEMBERUPDATE: {
            updated: (member) => `**${member.user.username}#${member.user.discriminator}** (${member})'} a été mis a jour.`,
            unknownChanges: "Changement inconnu",
            weird: "Le bot n'a pas pu récuperer le changement. Regardez le bas de l'embed pour voir qui a mis a jour le membre.",
            newNick: "Nouveau Pseudo",
            oldNick: "Ancien Pseudo",
            none: "Aucun",
            ID: (memberID, executorID) => `ID du Membre = ${memberID}\nModérateur = ${executorID}`
        },
        MESSAGE: {
            missingUserPerms: (permissions) => `[❌] - Vous n'avez pas les permissions suivantes: ${permissions}`,
            missingBotPerms: (permissions) => `[❌] - Le bot n'a pas les permissions suivantes: ${permissions}`,
            pleaseWait: (time) => `[❌] - Veuillez patienter **${time} secondes** avant d'utiliser la commande.`,
            restricted: '[❌] - Ce salon a été restreint pour l\'utilisation de commandes. Seuls les modérateurs peuvent y exécuter des commandes.',
            error: (error) => `Une erreur s'est produite: ${error.message}`,
            lvlUpMessage: "Félicitations {user}, tu es maintenant niveau **{level}** !"
        },
        MESSAGEDELETE: {
            deleted: (message) => `Un message de ${message.author} (${message.author.tag}) a été supprimé.`,
            deletedBy: "Supprimé par",
            attachment: "Fichier attaché",
            content: "Contenu du message"
        },
        MESSAGEDELETEBULK: {
            deleted: (messages, channel) => `**${messages.size}** messages ont été supprimés dans ${channel}.`,
            deletedBy: "Supprimés par",
            unknownUser: `Membre Inconnu`,
            header: `Le message le plus récent est en haut. Le message le plus ancien est en bas.\n\n\n\n`,
            contentWithoutMessage: (link) => `Fichier attaché: ${link}`,
            contentWithMessage: (link, message) => `Fichier attaché: ${link} | Message: ${message}`,
            noContent: "Aucun contenu n'a été trouvé..."
        },
        MESSAGEUPDATE: {
            updated: (author) => `Un message de ${author} (${author.tag}) a été mis a jour.`,
            oldMessage: "Ancien Message",
            newMessage: "Nouveau Message"
        },
        ROLECREATE: {
            unknownUser: `Membre Inconnu`,
            created: `Un rôle a été créé.`,
            createdBy: "Créé par",
        },
        ROLEDELETE: {
            unknownUser: "Membre Inconnu",
            deleted: `Un rôle a été supprimé`,
            createdBy: "Supprimé par",
            deletedLeft: `Suppression après le départ du membre`
        },
        ROLEUPDATE: {
            unknownUser: "Membre Inconnu",
            updated: (role) => `**Le rôle ${role} a été mis a jour. (${role.id})**`,
            updatedBy: 'Mis a jour par',
            now: "__**Maintenant**__",
            was: "__**Avant**__",
            footer: 'Regardez les logs Discord afin de voir quelles permissions ont été modifiées.'
        },
        VOICESTATEUPDATE: {
            joined: (member, channel) => `${member} **__a rejoins__ ${channel.name}**`,
            switch: (member, newChannel, oldChannel) => `${member} **__a rejoins__ ${newChannel.name}** et **__a quitté__ ${oldChannel.name}**.`,
            left: (member, channel) => `${member} **__a quitté__ ${channel.name}**`,
            updated: (newState) => `L'état de **${newState.member.user.username}#${newState.member.user.discriminator}** (${newState.member.id}) a été mis a jour.`,
            voiceChannel: "Salon Vocal",
            states: (oldState, newState) => `Avant: ${oldState}\nAprès: ${newState}`
        }
    }
}