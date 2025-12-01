import { defineEventHandler, getQuery } from 'h3'
import Parser from 'rss-parser'
import Anthropic from '@anthropic-ai/sdk'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)
    const search = q.q || "robos en imperial cañete perú"

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(search)}&hl=es-419&gl=PE&ceid=PE:es-419`

    const parser = new Parser()
    let feed

    try {
        feed = await parser.parseURL(rssUrl)
    } catch (err) {
        return { error: "Error al conectar con Google News" }
    }

    if (!feed.items.length) {
        return { error: "No se encontraron noticias" }
    }

    const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY!,
    })

    const analisisNoticias = await Promise.all(
        feed.items.map(async (noticia) => {
            try {
                const prompt = `
Analiza la siguiente noticia y devuelve SOLO un JSON válido con esta estructura:

{
  "tipo_robo": "",
  "lugar": "",
  "fecha_aprox": "",
  "gravedad": 1,
  "resumen": "",
  "latitud": null,
  "longitud": null
}

Si falta información, coloca null.

---
TÍTULO: ${noticia.title}
LINK: ${noticia.link}
CONTENIDO: ${noticia.contentSnippet || ""}
FECHA: ${noticia.pubDate || ""}
                `

                const response = await client.messages.create({
                    model: "claude-3-haiku-20240307",
                    max_tokens: 500,
                    messages: [{ role: "user", content: prompt }],
                })

                const jsonText = response.content[0].text

                return {
                    noticia: {
                        titulo: noticia.title,
                        link: noticia.link,
                        fecha: noticia.pubDate,
                        contenido: noticia.contentSnippet
                    },
                    analisis: JSON.parse(jsonText)
                }

            } catch (error) {
                return {
                    noticia: {
                        titulo: noticia.title,
                        link: noticia.link,
                        fecha: noticia.pubDate,
                        contenido: noticia.contentSnippet
                    },
                    analisis: { error: "No se pudo analizar esta noticia" }
                }
            }
        })
    )

    return {
        total: analisisNoticias.length,
        noticias: analisisNoticias
    }
})
