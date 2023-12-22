const chai = require('chai')
const expect = chai.expect
const { parseOpfMetadataXML } = require('../../../../server/utils/parsers/parseOpfMetadata')


describe('parseOpfMetadata - test series',  async () => {
    it('test one serie', async() => {
        const opf = `
            <?xml version='1.0' encoding='UTF-8'?>
            <package xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xml:lang="en" version="3.0" unique-identifier="bookid">
              <metadata>        
                  <meta name="calibre:series" content="Serie"/>
                  <meta name="calibre:series_index" content="1"/>
              </metadata>
            </package>          
        `
        const parsedOpf = await parseOpfMetadataXML(opf)
        expect(parsedOpf.series).to.deep.equal([{"name": "Serie","sequence": "1"}])
    })

    it('test more then 1 serie - in correct order', async() => {
        const opf = `
            <?xml version='1.0' encoding='UTF-8'?>
            <package xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xml:lang="en" version="3.0" unique-identifier="bookid">
              <metadata>        
                  <meta name="calibre:series" content="Serie 1"/>
                  <meta name="calibre:series_index" content="1"/>
                  <meta name="calibre:series" content="Serie 2"/>
                  <meta name="calibre:series_index" content="2"/>
                  <meta name="calibre:series" content="Serie 3"/>
                  <meta name="calibre:series_index" content="3"/>
              </metadata>
            </package>          
        `
        const parsedOpf = await parseOpfMetadataXML(opf)
        expect(parsedOpf.series).to.deep.equal([
            {"name": "Serie 1","sequence": "1"},
            {"name": "Serie 2","sequence": "2"},
            {"name": "Serie 3","sequence": "3"},
        ])
    })

    it('test messed order of series content and index', async() => {
        const opf = `
            <?xml version='1.0' encoding='UTF-8'?>
            <package xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xml:lang="en" version="3.0" unique-identifier="bookid">
              <metadata>        
                  <meta name="calibre:series" content="Serie 1"/>
                  <meta name="calibre:series_index" content="1"/>
                  <meta name="calibre:series_index" content="2"/>
                  <meta name="calibre:series_index" content="3"/>
                  <meta name="calibre:series" content="Serie 3"/>
              </metadata>
            </package>          
        `
        const parsedOpf = await parseOpfMetadataXML(opf)
        expect(parsedOpf.series).to.deep.equal([
            {"name": "Serie 1","sequence": "1"},
            {"name": "Serie 3","sequence": null},
        ])
    })

    it('test different values of series content and index', async() => {
        const opf = `
            <?xml version='1.0' encoding='UTF-8'?>
            <package xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf" xml:lang="en" version="3.0" unique-identifier="bookid">
              <metadata>        
                  <meta name="calibre:series" content="Serie 1"/>
                  <meta name="calibre:series_index"/>
                  <meta name="calibre:series" content="Serie 2"/>
                  <meta name="calibre:series_index" content="abc"/>
                  <meta name="calibre:series" content="Serie 3"/>
                  <meta name="calibre:series_index" content=""/>
              </metadata>
            </package>          
        `
        const parsedOpf = await parseOpfMetadataXML(opf)
        // console.log(JSON.stringify(parsedOpf, null, 4))
        expect(parsedOpf.series).to.deep.equal([
            {"name": "Serie 1", "sequence": null},
            {"name": "Serie 2", "sequence": "abc"},
            {"name": "Serie 3", "sequence": null},
        ])
    })
})
