{Aui, React} = require './deps.cjsx'

symbols = "♈☽♋♎♌♍♊♘☥♃♐☾♂♆☉♓☿♑☆♉♄♀♅♏☄♒".split ''
empowered = "🌠"
encryptor = {}
cypher = {}
for symbol, index in symbols
  encryptor[String.fromCharCode index + 65] = "#{empowered}#{symbol}"
  letter = String.fromCharCode index + 97
  encryptor[letter] = symbol
  cypher[symbol] = letter
#logs = []
magic =
  enscribe: window.enscribe = (scryt) ->
    #logs = []
    result = scryt.replace /[A-z]/g, (letter) ->
      rune = encryptor[letter] or letter
      #logs.push " #{letter} -> #{rune} "
      rune
    #console.log logs.join ''
    #console.log "Enscription: #{result}"
    result
  decypher: window.decypher = (enscription) ->
    #logs = []
    result = enscription.replace (new RegExp "(#{empowered})?(#{symbols.join '|'})", 'g'), (_, big, rune) ->
      letter = if big
          "#{cypher[rune] or rune}".toUpperCase()
        else
          "#{cypher[rune] or rune}"
      #logs.push " #{rune} -> #{letter} "
      letter
    #console.log logs.join ''
    result


Page = React.createClass
  mixins: [Aui.Mixin]
  getInitialState: -> icon: ''
  onClick: (event) ->
    event.target.select()
  onChange: (event) ->
    state = {}
    state[event.target.name] = magic[event.target.name] event.target.value
    @setState state
  render: ->
    <div ui page grid>
      <div ui inverted segment column>
        <form ui form onSubmit={(event) -> event.preventDefault()}>
          <div field>
            <textarea scryt ui inverted input name="enscribe" onKeyUp={@onChange} onClick={@onClick} placeholder="Pony Scryt" setValue={@state.decypher}></textarea>
          </div>
          <div field>
            <textarea ui inverted input name="decypher" onKeyUp={@onChange} onClick={@onClick} placeholder="🌠♂☉☉♆☆♓♌♈♐" setValue={@state.enscribe}></textarea>
          </div>
        </form>
      </div>
    </div>

React.render <Page/>, document.body
