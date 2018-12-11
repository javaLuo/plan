<template>
  <div>
    <h1 id="toc_0">Public API --go to
      <a href="https://www.rightbtc.com/ApiWeb/Trade-API"
         target="_blank">Trader API</a>
    </h1>

    <ul>
      <li>Public API for the exchange market data.</li>
      <li>Response Style: {&quot;status&quot;:{&quot;success&quot;:1},&quot;result&quot;:null} success if success = 1 and result is the return data.</li>
      <li>Base URL: https://rightbtc.com/api/public/</li>
    </ul>

    <hr>

    <h2 id="toc_1">DATA</h2>

    <h3 id="toc_2">DATA - CANDLESTICK LATEST</h3>

    <div>
      <pre><code class="language-none">Get the candlestick data for given trading pair and time intervals.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/candlestick/latest/:trading_pair</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl https://www.rightbtc.com/api/public/candlestick/latest/BTCCNY</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>result</td>
          <td>Object</td>
          <td>each key is a timeSymbol, and value is [time, volume, open, high, low, close], each price/quantity should divide by 1E8.</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: {
        &quot;hr4&quot;: [
            1497600000000,
            16223600000,
            1840473000000,
            1841676000000,
            1794081000000,
            1804602000000
        ],
        &quot;min5&quot;: [
            1497603300000,
            167600000,
            1804782000000,
            1805684000000,
            1804000000000,
            1804602000000
        ],
        &quot;hr1&quot;: [
            1497600000000,
            16223600000,
            1840473000000,
            1841676000000,
            1794081000000,
            1804602000000
        ],
        &quot;hr2&quot;: [
            1497600000000,
            16223600000,
            1840473000000,
            1841676000000,
            1794081000000,
            1804602000000
        ],
        &quot;min3&quot;: [
            1497603420000,
            75200000,
            1804281000000,
            1805002000000,
            1804281000000,
            1804602000000
        ],
        &quot;hr6&quot;: [
            1497592800000,
            48484500000,
            1795239000000,
            1842678000000,
            1788690000000,
            1804602000000
        ],
        &quot;hr12&quot;: [
            1497571200000,
            88001900000,
            1797087000000,
            1842678000000,
            1774141000000,
            1804602000000
        ],
        &quot;day3&quot;: [
            1497398400000,
            595937100000,
            1923589000000,
            1953699000000,
            1679953000000,
            1804602000000
        ],
        &quot;week&quot;: [
            1497484800000,
            318750300000,
            1826233000000,
            1842678000000,
            1679953000000,
            1804602000000
        ],
        &quot;day1&quot;: [
            1497571200000,
            88001900000,
            1797087000000,
            1842678000000,
            1774141000000,
            1804602000000
        ],
        &quot;min15&quot;: [
            1497602700000,
            1366700000,
            1807609000000,
            1817628000000,
            1804000000000,
            1804602000000
        ],
        &quot;min1&quot;: [
            1497603480000,
            74700000,
            1805002000000,
            1805002000000,
            1804281000000,
            1804602000000
        ],
        &quot;min30&quot;: [
            1497601800000,
            5635800000,
            1807307000000,
            1817628000000,
            1794081000000,
            1804602000000
        ]
    }
}</code></pre>
    </div>

    <h3 id="toc_3">DATA - CANDLESTICKS</h3>

    <ul>
      <li>Get the candlestick data for given trading pair and time intervals.</li>
    </ul>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/candlestick/:timeSymbol/:trading_pair/[:count]</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl https://www.rightbtc.com/api/public/candlestick/day1/BTCCNY/3</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>result</td>
          <td>Array</td>
          <td>candlestick, item is [time, volume, open, high, low, close], each price/quantity should divide by 1E8.</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: [
        [
            1497312000000,
            257689500000,
            1892576000000,
            1958910000000,
            1874050000000,
            1923589000000
        ],
        [
            1497398400000,
            277186800000,
            1923589000000,
            1953699000000,
            1748488000000,
            1826233000000
        ],
        [
            1497484800000,
            230748400000,
            1826233000000,
            1829151000000,
            1679953000000,
            1797087000000
        ]
    ]
}</code></pre>
    </div>

    <h3 id="toc_4">DATA - LIST TRADING PAIRS</h3>

    <div>
      <pre><code class="language-none">Returns all trading pairs.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/trading_pairs</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl https://www.rightbtc.com/api/public/trading_pairs</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>name</td>
          <td>String</td>
          <td>trding pair</td>
        </tr>
        <tr>
          <td>
            <code>ask_asset_symbol</code>
          </td>
          <td>String</td>
          <td>FIAT</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: {
              &quot;ONIONETH&quot;: {
                  &quot;name&quot;: &quot;ONIONETH&quot;,
                  &quot;bid_asset_symbol&quot;: &quot;ONION&quot;,
                  &quot;bid_asset_decimals&quot;: &quot;8&quot;,
                  &quot;bid_asset_type&quot;: &quot;COIN&quot;,
                  &quot;ask_asset_symbol&quot;: &quot;ETH&quot;,
                  &quot;ask_asset_decimals&quot;: &quot;8&quot;,
                  &quot;ask_asset_type&quot;: &quot;FIAT&quot;
                           },.....
                  }
              }
}</code></pre>
    </div>

    <h3 id="toc_5">DATA - ORDERBOOK</h3>

    <ul>
      <li>Get the current orderbook for given trading pair.</li>
    </ul>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/depth/:trading_pair/[:count]</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl https://www.rightbtc.com/api/public/depth/BTCCNY</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>market</td>
          <td>String</td>
          <td>trading pair</td>
        </tr>
        <tr>
          <td>ask</td>
          <td>Array</td>
          <td>ask depth, fisrt item is best ask, item order is [price, quantity, total quantity], each price/quantity should divide by 1E8.</td>
        </tr>
        <tr>
          <td>bid</td>
          <td>Array</td>
          <td>bid depth, fisrt item is best bid, item order is [price, quantity, total quantity], each price/quantity should divide by 1E8.</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: {
        &quot;market&quot;: &quot;BTCCNY&quot;,
        &quot;ask&quot;: [
            [
                2000000000000,
                100000000,
                100000000
            ],
            [
                2000100000000,
                100000000,
                200000000
            ],
            [
                2000200000000,
                100000000,
                300000000
            ]
        ],
        &quot;bid&quot;: [
            [
                1999900000000,
                100000000,
                100000000
            ],
            [
                1999800000000,
                100000000,
                200000000
            ],
            [
                1999700000000,
                100000000,
                300000000
            ]
        ]
    }
}</code></pre>
    </div>

    <h3 id="toc_6">DATA - TICKER</h3>

    <div>
      <pre><code class="language-none">Get the ticker for given trading pair.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/ticker/:trading_pair</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl https://www.rightbtc.com/api/public/ticker/BTCCNY</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>market</td>
          <td>String</td>
          <td>trading pair</td>
        </tr>
        <tr>
          <td>date</td>
          <td>Number</td>
          <td>time in milliseconds</td>
        </tr>
        <tr>
          <td>sell</td>
          <td>Number</td>
          <td>best sell price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>buy</td>
          <td>Number</td>
          <td>best buy price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>high</td>
          <td>Number</td>
          <td>highest price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>low</td>
          <td>Number</td>
          <td>lowest price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>last</td>
          <td>Number</td>
          <td>latest price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>last24h</td>
          <td>Number</td>
          <td>price at 24 hours ago, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>vol</td>
          <td>Number</td>
          <td>volume calculated by day, should divide by 1E8.</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response </p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: {
        &quot;market&quot;: &quot;BTCCNY&quot;,
        &quot;date&quot;: 1497602424876,
        &quot;sell&quot;: 1801596000000,
        &quot;buy&quot;: 1799141000000,
        &quot;high&quot;: 1842678000000,
        &quot;low&quot;: 1774141000000,
        &quot;last&quot;: 1801349000000,
        &quot;last24h&quot;: 1759121000000,
        &quot;vol&quot;: 86300900000
    }
}
</code></pre>
    </div>

    <h3 id="toc_7">DATA - TICKERS</h3>

    <div>
      <pre><code class="language-none">Get the tickers for all trading pair.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/tickers</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl https://www.rightbtc.com/api/public/tickers</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>market</td>
          <td>String</td>
          <td>trading pair</td>
        </tr>
        <tr>
          <td>date</td>
          <td>Number</td>
          <td>time in milliseconds</td>
        </tr>
        <tr>
          <td>sell</td>
          <td>Number</td>
          <td>best sell price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>buy</td>
          <td>Number</td>
          <td>best buy price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>high</td>
          <td>Number</td>
          <td>highest price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>low</td>
          <td>Number</td>
          <td>lowest price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>last</td>
          <td>Number</td>
          <td>latest price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>last24h</td>
          <td>Number</td>
          <td>price at 24 hours ago, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>vol</td>
          <td>Number</td>
          <td>volume calculated by day, should divide by 1E8.</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response</p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: [
        {
            &quot;market&quot;: &quot;OBSCNY&quot;,
            &quot;date&quot;: 1497601212761,
            &quot;sell&quot;: 2043000000,
            &quot;buy&quot;: 1963010000,
            &quot;high&quot;: 2097200000,
            &quot;low&quot;: 1900000000,
            &quot;last&quot;: 2043000000,
            &quot;last24h&quot;: 2080000000,
            &quot;vol&quot;: 427342840000
        },
        {
            &quot;market&quot;: &quot;ZECCNY&quot;,
            &quot;date&quot;: 1497601217414,
            &quot;sell&quot;: 270900000000,
            &quot;buy&quot;: 270000000000,
            &quot;high&quot;: 287158000000,
            &quot;low&quot;: 254156000000,
            &quot;last&quot;: 270094000000,
            &quot;last24h&quot;: 256418000000,
            &quot;vol&quot;: 934208800000
        },
        {
            &quot;market&quot;: &quot;ETCCNY&quot;,
            &quot;date&quot;: 1497601216148,
            &quot;sell&quot;: 12814000000,
            &quot;buy&quot;: 12775000000,
            &quot;high&quot;: 12968000000,
            &quot;low&quot;: 12191000000,
            &quot;last&quot;: 12803000000,
            &quot;last24h&quot;: 12785000000,
            &quot;vol&quot;: 2166115000000
        },
        {
            &quot;market&quot;: &quot;ETHCNY&quot;,
            &quot;date&quot;: 1497601215973,
            &quot;sell&quot;: 264131000000,
            &quot;buy&quot;: 263898000000,
            &quot;high&quot;: 267622000000,
            &quot;low&quot;: 236690000000,
            &quot;last&quot;: 264070000000,
            &quot;last24h&quot;: 245682000000,
            &quot;vol&quot;: 11648096800000
        },
        {
            &quot;market&quot;: &quot;BTSCNY&quot;,
            &quot;date&quot;: 1497601214341,
            &quot;sell&quot;: 231240000,
            &quot;buy&quot;: 230960000,
            &quot;high&quot;: 240150000,
            &quot;low&quot;: 217930000,
            &quot;last&quot;: 231060000,
            &quot;last24h&quot;: 222780000,
            &quot;vol&quot;: 563423920490000
        },
        {
            &quot;market&quot;: &quot;ETPCNY&quot;,
            &quot;date&quot;: 1497601208510,
            &quot;sell&quot;: 3350000000,
            &quot;buy&quot;: 3349000000,
            &quot;high&quot;: 3350000000,
            &quot;low&quot;: 3156000000,
            &quot;last&quot;: 3350000000,
            &quot;last24h&quot;: 3165000000,
            &quot;vol&quot;: 3067245000000
        },
        {
            &quot;market&quot;: &quot;BTCCNY&quot;,
            &quot;date&quot;: 1497601209883,
            &quot;sell&quot;: 1826644000000,
            &quot;buy&quot;: 1826575000000,
            &quot;high&quot;: 1842678000000,
            &quot;low&quot;: 1774141000000,
            &quot;last&quot;: 1826646000000,
            &quot;last24h&quot;: 1775544000000,
            &quot;vol&quot;: 76237000000
        }
    ]
}</code></pre>
    </div>

    <h3 id="toc_8">DATA - TRADES</h3>

    <div>
      <pre><code class="language-none">Get the latest trades for given trading pair.</code></pre>
    </div>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/trades/:trading_pair/[:count]</p>
    </blockquote>

    <p>Example Usage:</p>

    <blockquote>
      <p>curl https://www.rightbtc.com/api/public/trades/BTCCNY/3</p>
    </blockquote>

    <p>
      <strong>Success 200</strong>
    </p>

    <p>Parameter:</p>

    <table>
      <thead>
        <tr>
          <th>Field</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>date</td>
          <td>Number</td>
          <td>time in milliseconds.</td>
        </tr>
        <tr>
          <td>price</td>
          <td>Number</td>
          <td>trade price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>amount</td>
          <td>Number</td>
          <td>trade price, should divide by 1E8.</td>
        </tr>
        <tr>
          <td>tid</td>
          <td>Number</td>
          <td>trade ID.</td>
        </tr>
        <tr>
          <td>side</td>
          <td>Number</td>
          <td>BUY or SELL</td>
        </tr>
      </tbody>
    </table>

    <p>Success-Response</p>

    <div>
      <pre><code class="language-none">{
    &quot;status&quot;: {
        &quot;success&quot;: 1,
        &quot;message&quot;: null
    },
    &quot;result&quot;: [
        {
            &quot;date&quot;: 1497601992136,
            &quot;price&quot;: 1795684000000,
            &quot;amount&quot;: 4100000,
            &quot;tid&quot;: 8004750,
            &quot;side&quot;: &quot;BUY&quot;
        },
        {
            &quot;date&quot;: 1497601992136,
            &quot;price&quot;: 1795052000000,
            &quot;amount&quot;: 18800000,
            &quot;tid&quot;: 8004752,
            &quot;side&quot;: &quot;BUY&quot;
        },
        {
            &quot;date&quot;: 1497601999035,
            &quot;price&quot;: 1794982000000,
            &quot;amount&quot;: 22900000,
            &quot;tid&quot;: 8004784,
            &quot;side&quot;: &quot;SELL&quot;
        }
    ]
}</code></pre>
    </div>

    <h2 id="toc_9">TRADING</h2>

    <ul>
      <li>
        <p>TRADING - 根据语言返回相应国际化TRADING PAIR数据</p>
      </li>
      <li>
        <p>Returns the available tradings pairs.</p>
      </li>
    </ul>

    <p>
      <strong>GET</strong>
    </p>

    <blockquote>
      <p>/getAssetsTradingPairs/zh</p>
    </blockquote>

  </div>
</template>

<script>
export default {
  layout: 'apiLayout',
};
</script>

<style scoped>
@import '../../assets/css/api.css';
</style>

