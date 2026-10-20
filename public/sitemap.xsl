<?xml version="1.0" encoding="UTF-8"?>
<!-- Makes the sitemaps readable in a browser. Search engines ignore this file and read the XML directly. -->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>Sitemap | Vaibhav Pasi</title>
        <style>
          :root { color-scheme: dark; }
          body { margin: 0; background: #090B0F; color: #F5F3EE; font: 15px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
          main { max-width: 960px; margin: 0 auto; padding: 48px 20px 64px; }
          h1 { margin: 0 0 6px; font-size: 28px; letter-spacing: -0.02em; }
          h1 span { color: #D6B675; }
          p.lead { margin: 0 0 28px; color: #9198A5; }
          p.lead a { color: #D6B675; }
          table { width: 100%; border-collapse: collapse; background: #151922; border: 1px solid #262a33; border-radius: 14px; overflow: hidden; }
          th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #262a33; vertical-align: top; }
          th { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #9198A5; font-weight: 600; }
          tr:last-child td { border-bottom: 0; }
          td a { color: #F5F3EE; text-decoration: none; word-break: break-all; }
          td a:hover { color: #D6B675; }
          td.num { color: #9198A5; white-space: nowrap; }
          .muted { color: #9198A5; font-size: 13px; }
          @media (max-width: 600px) { .hide-sm { display: none; } }
        </style>
      </head>
      <body>
        <main>
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <h1>Sitemap <span>index</span></h1>
              <p class="lead">
                <xsl:value-of select="count(s:sitemapindex/s:sitemap)"/> sitemaps, one per section of
                <a href="/">vaibhavpasi.online</a>. Search engines read these files to find every page.
              </p>
              <table>
                <tr><th>Sitemap</th><th>Last updated</th></tr>
                <xsl:for-each select="s:sitemapindex/s:sitemap">
                  <tr>
                    <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                    <td class="num"><xsl:value-of select="s:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </table>
            </xsl:when>
            <xsl:otherwise>
              <h1>Sitemap</h1>
              <p class="lead">
                <xsl:value-of select="count(s:urlset/s:url)"/> pages. <a href="/sitemap.xml">Back to the sitemap index</a>
              </p>
              <table>
                <tr><th>Page</th><th class="hide-sm">Images</th><th>Last updated</th></tr>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                    <td class="num hide-sm"><xsl:value-of select="count(image:image)"/></td>
                    <td class="num"><xsl:value-of select="s:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </table>
            </xsl:otherwise>
          </xsl:choose>
          <p class="muted">This page is a readable view of an XML sitemap.</p>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
