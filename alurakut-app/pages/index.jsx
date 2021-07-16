import { useState, useEffect } from 'react';
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  console.log(props);
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />

      <hr />

      <p> 
        <a  className="boxLink" href={`https://github.com/${props.githubUser}.png`} style={{ borderRadius:"8px" }}>
          @{props.githubUser}
        </a>
      </p>
      
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      <ul>
        {/* {seguidores.map((itemAtual) => {
          return (
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home() {
    
    const usuarioAleatorio = 'bernardoblasquez';
    const [comunidades, setComunidades] = useState([{}]);
    
    
    const pessoasFavoritas = [
      'omariosouto',
      'filipedeschamps',
      'flaviohenriquealmeida',
      'maykbrito',
      'diego3g',
      'kevin-powell'
    ]

    const [seguidores, setSeguidores] = useState([]);
      
    useEffect(function() {

        fetch('https://api.github.com/users/peas/followers')
        .then(function (respostaDoServidor) {
          return respostaDoServidor.json();
        })
        .then(function(respostaCompleta) {
          setSeguidores(respostaCompleta);
          console.log(respostaCompleta)
        })

        //API GraphQL
        fetch(
          'https://graphql.datocms.com/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `09ccfaa3b0c22bda9d2163034818bb`,
            },
            body: JSON.stringify({
              query: `query{
                allCommunities {
                  id
                  title
                  imageUrl
                  creatorSlug
                }
              }`
            }),
          }
        )
        .then(response => response.json())
        .then((completeResponse) => {
          const comunidadesDATO = completeResponse.data.allCommunities;
          setComunidades(comunidadesDATO)
          console.log(completeResponse)
        })

    }, [])


    const handleCriaComunidade = (event) => {
      event.preventDefault();
      const dadosDoForm = new FormData(event.target);

      const comunidade = {
        title: dadosDoForm.get('title'),
        imageUrl: dadosDoForm.get('image'),
        creatorSlug: usuarioAleatorio,
      }

      //console.log(comunidade)

      fetch('/api/comunidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comunidade)
      })
      .then( async(response) => {
        const dados = await response.json();
        console.log(dados.registroCriado);
        const comunidade = dados.registroCriado;
        const comunidadesAtualizadas = [...comunidades, comunidade];
        setComunidades(comunidadesAtualizadas)
      })

     // const comunidadesAtualizadas = [...comunidades, comunidade];
     // setComunidades(comunidadesAtualizadas)
    }

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        {/* <Box style="grid-area: profileArea;"> */}
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a) 
            </h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>

            <form onSubmit={handleCriaComunidade}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                  />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>

              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
         
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((comunidade) => {
                return (
                  <li key={comunidade.id}>
                    <a href={`/comunidades/${comunidade.title}`}>
                      <img src={comunidade.imageUrl} />
                      <span>{comunidade.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li>
                    <a href={`/users/${itemAtual}`} key={itemAtual}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
            
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}
