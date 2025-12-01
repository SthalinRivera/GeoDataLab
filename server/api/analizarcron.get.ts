import { defineEventHandler, getQuery } from 'h3'
import Parser from 'rss-parser'
import Anthropic from '@anthropic-ai/sdk'

export default defineEventHandler(async (event) => {
    const q = getQuery(event)

    // Permitir búsqueda personalizada o usar la predeterminada
    const search = q.q || "robos OR asaltos OR accidentes imperial, san vicente, chilca en cañete Perú"

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(search)}&hl=es-419&gl=PE&ceid=PE:es-419`

    const parser = new Parser()
    let feed

    try {
        feed = await parser.parseURL(rssUrl)
    } catch (err) {
        return { error: "Error al conectar con Google News" }
    }   

    if (!feed.items?.length) {
        return { error: "No se encontraron noticias" }
    }

    const DIAS = 90
    const ahora = Date.now()
    const rangoTiempo = DIAS * 24 * 60 * 60 * 1000

    const ultimasNoticias = feed.items.filter(item => {
        if (!item.pubDate) return false
        const fecha = new Date(item.pubDate).getTime()
        return (ahora - fecha) <= rangoTiempo
    })

    if (!ultimasNoticias.length) {
        return { error: `No hay noticias recientes en los últimos ${DIAS} día(s)` }
    }

    // --- IA CLIENT ---
    const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY!,
    })

    const analisisNoticias = await Promise.all(
        ultimasNoticias.map(async (noticia) => {
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
  "longitud": null,
  "distrito": ""
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
                const analisis = JSON.parse(jsonText)

                return {
                    noticia: {
                        titulo: noticia.title,
                        link: noticia.link,
                        fecha: noticia.pubDate,
                        contenido: noticia.contentSnippet
                    },
                    analisis: analisis
                }

            } catch (error) {
                console.error('Error analizando noticia:', error)
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
        noticias: analisisNoticias,
        timestamp: new Date().toISOString()
    }
})