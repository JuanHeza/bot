class BotRequest {
    token: string
    id: string
    headers: {
        Authorization: string,
        "Content-Type": String
    }
    // headersNoBearer: {
    //     Authorization: string,
    //     "Content-Type": String
    // }
    baseUrl: string
    listTemplate: {
        titulo: string,
        botones: {
            id: string,
            titulo: string,
            description: string
        }[]
    }[]
    buttonsTemplate: {
        id: string,
        text: string
    }[]
    locationTemplate: {
        latitude: number,
        longitude: number,
        name: string,
        address: string
    }
    constructor(token: string, id: string) {
        this.token = token
        this.id = id
        this.headers = {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json"
        }
        // this.headersNoBearer = {
        //     Authorization: `${this.token}`,
        //     "Content-Type": "application/json"
        // }
        this.baseUrl = `https://graph.facebook.com/v17.0/${this.id}/`
        this.listTemplate = [{ titulo: "Template", botones: [{ id: "ubicacion", titulo: "Ubicacion", description: "No hay datos" }, { id: "media", titulo: "Media", description: "No hay datos" }] }]
        this.buttonsTemplate = [{ id: "inicio", text: "Inicio" }]
        this.locationTemplate = { latitude: 25.6854215, longitude: -100.3443915, name: "Local", address: "Ubicacion" }
    }

    getHeaderMessage() {
        return {
            method: 'POST',
            url: this.baseUrl + "messages",
            headers: this.headers
        }
    }

    // getHeaderNoBearerMessage() {
    //     return {
    //         method: 'POST',
    //         url: this.baseUrl + "messages",
    //         headers: this.headersNoBearer
    //     }
    // }

    buildText(to: string = "", body: string = "", preview: boolean = false) {
        return to == null ? null : {
            ...this.getHeaderMessage(),
            data: {
                messaging_product: 'whatsapp',
                to: to,
                recipientType: 'individual',
                type: 'text',
                text: {
                    preview_url: preview,
                    body: body
                },
            }
        }
    }

    buildButtons(to: string = "", body: string = "", buttons = this.buttonsTemplate, actionHeader = null, actionFooter = null) {
        let setHeader = (h) => {
            switch (h.type) {
                case "text":
                    return { text: header.value }
                case "image":
                    return { image: { link: header.value } }
                case "document":
                    return { document: { link: header.value } }
                case "video":
                    return { video: { link: header.value } }
                default:
                    return {}
            }
        }
        console.log(buttons)
        return to == null ? null : {
            ...this.getHeaderMessage(),
            data: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: body
                    },
                    header: actionHeader && {
                        type: actionHeader.type,
                        ...(setHeader(actionHeader))
                    },
                    footer: actionFooter && {
                        text: actionFooter
                    },
                    action: {
                        buttons: buttons.reduce((acc, curr) => {
                            return [
                                ...acc,
                                {
                                    type: "reply",
                                    reply: {
                                        id: curr.id,
                                        title: curr.text
                                    }
                                }
                            ]
                        }, [])
                    }
                }
            }
        }
    }

    buildList(to = null, text = {}, list = this.listTemplate) {
        //console.log(list)
        return to == null ? null : {
            ...this.getHeaderMessage(),
            data: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "list",
                    header: text.header && {
                        type: "text",
                        text: text.header
                    },
                    body: text.body && {
                        text: text.body
                    },
                    footer: text.footer && {
                        text: text.footer
                    },
                    action: {
                        button: text.boton.slice(0, 20) || "Boton",
                        sections: list.reduce((acc, curr) => {
                            return [...acc,
                            {
                                title: curr.titulo.slice(0, 24),
                                rows: curr.botones.reduce((subacc, subcurr) => {
                                    return [...subacc,
                                    {
                                        id: subcurr.id,
                                        title: subcurr.titulo.slice(0, 24),
                                        description: subcurr.description?.slice(0, 72) || ""
                                    }
                                    ]
                                }, [])
                            }
                            ]
                        }, [])
                    }
                }
            }
        }
    }

    buildLocation(to = null, location = this.locationTemplate, text = { header: "hola", body: "esto es una prueba", footer: "la prueba funciona si puedes ver esto" }) {
        return to == null ? null : {
            ...this.getHeaderMessage(),
            data: {
                messaging_product: "whatsapp",
                to: to,
                type: "location",
                header: text.header && {
                    type: "text",
                    text: text.header
                },
                body: text.body && {
                    text: text.body
                },
                footer: text.footer && {
                    text: text.footer
                },
                location: location
            }
        }
    }

    buildImageButtons(to = null, body = "", imageLink = "https://www.sanjorgecc.com.mx/sblock/admin/images/ban_1.png", buttons = this.buttonsTemplate) {
        return to == null ? null : {
            ...this.getHeaderMessage(),
            data: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: body
                    },
                    header: {
                        type: "image",
                        image: { link: imageLink }
                    },
                    action: {
                        buttons: buttons.reduce((acc, curr) => {
                            return [
                                ...acc,
                                {
                                    type: "reply",
                                    reply: {
                                        id: curr.id,
                                        title: curr.text
                                    }
                                }
                            ]
                        }, [])
                    }
                }
            }
        }
    }

    /* No se esta usando  */
    buildMedia(to = null, type = "image", src = { id: null, link: "https://placekitten.com/g/450/400" }, fileName = "") {
        /*
            audio : 16 MB | audio/aac, audio/mp4, audio/mpeg, audio/amr, audio/ogg
            document : 100 MB | text/plain, application/pdf, application/vnd.ms-powerpoint, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
            image : 5 MB | image/jpeg, image/png
            video : 16 MB | video/mp4, video/3gp
            sticker : 100KB o 500KB | image/webp
        */
        return (to == null && (!src.id || !src.link)) ? null : {
            ...this.getHeaderMessage(),
            data: {
                messaging_product: "whatsapp",
                to: to,
                type: type,
                header: {
                    type: "text",
                    text: "Prueba de cabecera"
                },
                image: {
                    ...src,
                    ...(type == "document" ? { filename: fileName } : {})
                }
            }
        }
    }

    /* PENDIENTE DE TERMINAR, PROBABLEMENTE NO SE USE */
    buildContact(to = null, emails = { home: null, work: null }, address = { home: null, work: null }) {
        return to == null ? null : {
            ...this.getHeaderMessage(),
            messaging_product: "whatsapp",
            to: to,
            type: "contacts",
            contacts: []
        }
    }

    /* CREO QUE NO FUNCIONA */
    setRead(id = null) {
        return id == null ? {} : {
            ...this.getHeaderMessage(),
            data: {
                messaging_product: "whatsapp",
                status: "read",
                message_id: id
            }
        }
    }

}
export = BotRequest