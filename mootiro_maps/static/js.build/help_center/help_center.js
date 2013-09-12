var $,HelpCenter,__bind=function(e,t){return function(){return e.apply(t,arguments)}};$=jQuery,HelpCenter=function(){function e(e,t,n){this.show=__bind(this.show,this),this.tour_setup=__bind(this.tour_setup,this),this.modal_setup=__bind(this.modal_setup,this);var r;this.button=$(e),this.button.on("click",this.show),this.questions=function(){var e,n,i;i=[];for(e=0,n=t.length;e<n;e++)r=t[e],i.push(this.questions_config[r]);return i}.call(this),n&&(this.tour=this.tours_config[n]),this.modal_setup(),this.tour_setup()}return e.prototype.tour_tpl="        <!------------ PAGE TOUR ----------->        <ol id='joyride'>          <% for (var j = 0; j < tour.slides.length; j++) { %>          <li data-selector='<%= tour.slides[j].selector %>'            data-button='<% if (j != tour.slides.length-1) { print(gettext('Next')); } else { print(gettext('Finish')); } %>'            data-options='<%= tour.slides[j].options %>'            data-offsetX='<%= tour.slides[j].offsetX %>'            data-offsetY='<%= tour.slides[j].offsetY %>'          >            <h2><%= tour.slides[j].title %></h2>            <p><%= tour.slides[j].body %></p>          </li>          <% } %>        </ol>        <!--------------------------------->        ",e.prototype.modal_tpl="        <div id='help_center' class='modal hide fade'>          <div class='modal-header'>            <button type='button' class='close' data-dismiss='modal'>×</button>            <h2><%= gettext('Help Center') %></h2>          </div>          <section class='modal-body'>            <ul id='questions'>              <% for (var i = 0; i < questions.length; i++) { %>              <li class='<%= questions[i].type %>'>                <!------------ QUESTION ----------->                <article>                  <h3><%= questions[i].title %></h3>                  <p><%= questions[i].body %></p>                </article>                <!--------------------------------->              </li>              <% } %>            </ul>            <% if (hasTour) { %><button id='tour_button'><%= gettext('Take the guided tour') %></button><% } %>            <a id='help_center_about' href='/about/'><%= gettext('About') %></a>            <a id='help_center_usecases' href='/use_cases/'><%= gettext('Use Cases') %></a>          </section>        </div>        ",e.prototype.modal_setup=function(){var e;return e=_.template(this.modal_tpl,{questions:this.questions,hasTour:this.tour!=null}),this.$modal=$(e),this.$modal.modal({show:!1}),$("body").append(this.$modal)},e.prototype.tour_setup=function(){var e,t;if(this.tour==null)return;return e=_.template(this.tour_tpl,{tour:this.tour}),this.$tour_content=$(e),$("body").append(this.$tour_content),t=this.$modal,$("button#tour_button",this.$modal).on("click",function(){return t.modal("hide"),$("#joyride").joyride({afterShowCallback:function(){var e,t,n,r;return n=this.$current_tip.offset().left,r=this.$current_tip.offset().top,e=this.$li.attr("data-offsetX"),t=this.$li.attr("data-offsetY"),e=e==="undefined"?0:parseInt(e),t=t==="undefined"?0:parseInt(t),this.$current_tip.offset({left:n+e,top:r+t})}})})},e.prototype.show=function(){return this.$modal.modal("show")},e.prototype.questions_config={"home:others_edition":{body:'Na página de cada objeto cadastrado o botão "Histórico" apresenta informações sobre a criação e edições recentes.',title:"Como eu posso saber se outro usuário editou um cadastro?"},"community:what_is":{body:"Comunidade pode ser uma rua, bairro, favela, cidade, aldeia indígena etc., ou seja, um determinado território. Mapear uma comunidade é o primeiro passo para o desenvolvimento local e permite que sejam realizados diagnósticos territoriais.",title:'O que é uma "comunidade" e por que mapeá-la?'},"user:name_edition":{body:'Sim. Na página do usuário clique no campo "Nome" e edite. Para tanto é preciso estar logado.',title:"Posso editar meu nome?"},"user:password":{body:"Não há limite de caracteres para a senha, mas quanto mais letras e números misturados mais segura será sua senha.",title:"Como deve ser a minha senha?"},"home:mootiro_maps":{body:"É uma plataforma de mapeamento colaborativo de comunidades, suas organizações, recursos e necessidades voltada para o desenvolvimento comunitário.",title:"O que é o MootiroMaps?"},"user:data":{body:"O MootiroMaps tem como um de seus objetivos conectar mapeadores possibilitando que troquem experiências, conheçam outros projetos e colaborem entre si. Informações de contato e de localização são importantes para que outros usuários possam entrar em contato com você.",title:"Por que informar meus dados?"},"community:geometry_edition":{body:'Sim! Para você editar os pontos no mapa de uma comunidade, abra o cadastro da comunidade. Lá, clique no botão "editar" (lápis). Dentro do cadastro você encontrará uma opção para abrir o editor de mapas. Arraste os pontos e salve sua edição.',title:"Posso editar os pontos no mapa de uma comunidade?"},"need:proposal":{body:"Para que os usuários, principalmente os moradores daquela região, possam juntos debater as necessidades e como resolvê-las.",title:"Para que servem as propostas?"},"need:discuss":{body:"Basta clicar no botão [[[tal]]] e inserir sua opinião e reflexão sobre a necessidade.",title:"Como discutir uma necessidade?"},"investment:what_is":{body:"Trata-se de um investimento social que envolve ou não dinheiro, feito por empresas, fundações, pessoas físicas. O cadastro é fundamental para gerar transparência e apresentar a relação entre investidores e organizações que receberam o investimento.",title:'O que é um "investimento" e por que cadastrá-lo?'},"map:radius_search":{body:"Usando essa ferramenta é possível escolher um ponto central no mapa e estabelecer o raio de distância em que você deseja visualizar os objetos mapeados. Trata-se de um modo prático para o diagnóstico territorial.",title:'O que significa a "Busca por raio"?'},"project:what_is":{body:"Projetos são ações de mapeamento que estão acontecendo no MootiroMaps. Dentro do projeto podem ser reaproveitados todos os objetos e informações já criados no mapa.",title:'O que é um "projeto" e por que cadastrá-lo?'},"home:search":{body:'A principal ferramenta de busca está localizada no cabeçalho do MootiroMaps, onde podem ser inseridos endereços ou nomes de organizações, comunidades etc. É possível também acessar no menu superior a página de cada tipo de objeto e inserir palavras-chaves no campo "Opções de Visualização e Filtragem" para uma busca mais específica nas listas.',title:"Como posso buscar um objeto no MootiroMaps?"},"resource:acronym":{body:"Ao criar ou editar um cadastro é importante usar sigla e nome do recurso para facilitar a busca. Existem recursos que são mais conhecidas pela sua sigla. Exemplo: Centro da Juventude - CJ.",title:"Por que é importante inserir a sigla junto ao nome do recurso?"},"organization:transparency":{body:"Para atender ativamente a Lei de Acesso à Informação (Lei 12.527) e permitir que os cidadãos acessem com facilidade informações como CNPJ, financiamento, parceiros etc.",title:"Por que a transparência das informações sobre uma organização é importante?"},"home:denounce_content":{body:'Sim. Ao final da página de cada objeto cadastrado o botão "Denunciar" permite que o usuário registre sua denúncia.',title:"Eu posso denunciar um cadastro?"},"project:batch_upload":{body:'A importação de dados é importante, para disponibilizar no mapa informações que você já coletou ou tem disponível em planilhas. Para adicionar dados em lote, você deve clicar no botão "importar dados" e criar uma nova planilha de importação.',title:"Por que e como adicionar dados em lote?"},"home:who_can_use":{body:"Qualquer pessoa ou organização pode navegar e utilizar a plataforma.",title:"Quem pode usar o MootiroMaps?"},"user:name":{body:"Você pode escolher qualquer nome, mas preferimos que use seu primeiro nome e sobrenome.",title:"Como deve ser o meu nome?"},"need:name":{body:'O título deve descrever, de forma precisa e através de palavras-chaves, do que se trata a necessidade. Exemplos: "buraco na rua", "falta de computador", "construção de escola" etc.',title:"O título da necessidade deve conter quais informações?"},"resource:difference_organization":{body:"Organização é uma entidade que normalmente apresenta estrutura física, CNPJ, colaboradores. Recurso pode ser entendido como o projeto desenvolvido por uma organização, equipamentos, materiais ou espaços existentes na comunidade ou como um grupo de pessoas (coletivo) promovendo o desenvolvimento comunitário.",title:"Qual é a diferença entre um recurso e uma organização?"},"organization:what_is":{body:"São ONGs, associações de bairro, entidades em geral que atuam no Terceiro Setor, empresas, prefeituras. O cadastro ajuda a gerar visibilidade e a criar relação com outras ONGs, além de associar recursos, necessidades, investimentos etc.",title:'O que é uma "organização" e por que cadastrá-la?'},"need:description":{body:"A descrição deve explicar do melhor modo possível a situação da necessidade: sua localização, materiais ou recursos úteis para resolvê-la, se uma pessoa ou organização já está cuidando disso etc.",title:'O que devo inserir no campo "descrição"?'},"need:categories":{body:"Classificar as áreas facilita a busca mais específica na página das necessidades. Além disso, é útil para os investidores escolherem a área onde desejam aplicar seus recursos. ",title:'O que são as "áreas" e para que servem?'},"home:collaborative_mapping":{body:"Com o mapeamento moradores e organizações sociais - atuando colaborativamente - georreferenciam situações de vulnerabilidade em suas comunidades, geram de forma autônoma indicadores e buscam mudanças para as realidades locais propondo soluções.",title:'O que significa "mapeamento colaborativo"?'},"investment:name":{body:"Deve ser inserido o nome do projeto apoioda pelo investimento.",title:'O que devo inserir no campo "Título"?'},"user:location":{body:"Para possibilitar que outros mapeadores que atuam ou moram perto de você conheçam sua localização e possam entrar em contato.",title:"Por que informar minha localização? "},"community:search_data":{body:"Em sites como o do IBGE (http://www.ibge.gov.br/) ou da prefeitura/subprefeitura de sua cidade.",title:"Como posso encontrar dados sobre a comunidade?"},"user:public_contact":{body:"São informações como email, Skype, contas de redes sociais, por onde outros usuários poderão entrar em contato com você.",title:"O que significa o contato público?"},"community:description (copy)":{body:"Informações como localização, infra-estrutura, histórico, população, perfil sócio-econômico, economia, características principais, fontes das informações (site da prefeitura etc.)",title:'O que devo informar no campo "descrição"?'},"investment:transparency":{body:"Para atender à Lei de Acesso à Informação, informar os moradores locais sobre quais as empresas e investidores que estão ajudando a comunidade ou a organização com recursos.",title:"Por que a transparência das informações sobre um investimento é importante?"},"home:cost":{body:"Não.  O MootiroMaps é um software livre e gratuito. Você pode tanto criar uma conta ou também baixar o código de nosso repositório e instalar em seu servidor.",title:"Preciso pagar para usar o MootiroMaps?"},"organization:acronym":{body:"Ao criar ou editar um cadastro é importante usar a sigla e o nome da organização para facilitar a busca. Existem organizações que são mais conhecidas por sua sigla. Exemplo: Instituto de Fomento à Tecnologia do Terceiro Setor - IT3S.",title:"Por que é importante inserir a sigla junto ao nome da organização?"},"user:delete":{body:"Atualmente é preciso solicitar ao administrador que sua conta seja apagada.",title:"Posso apagar minha conta?"},"community:related_info":{body:"É legal você inserir imagens que representam bem sua comunidade, tais como fotos de ruas principais, centros comunitários ou parques centrais etc. Se houver coloque referências que você usou.",title:"Que tipo de arquivos ou links são importantes para inserir no cadastro?"},"project:description":{body:"Objetivos e finalidades do mapeamento, territórios de atuação, coordenadores, histórico, estratégias de pesquisa, resultados de pesquisa, fontes das informações etc.",title:'Que tipo de informações devo adicionar ao campo "descrição"?'},"resource:what_is":{body:"São equipamentos e serviços disponíveis no território, como praças, bibliotecas comunitárias, programas voltados à alfabetização, prevenção de doenças etc. O cadastro permite que a comunidade mensure a quantidade e qualidade desses recursos.",title:'O que é um "recurso" e por que cadastrá-lo?'},"need:target_audience":{body:"São os grupos de pessoas atingidos pelas necessidades ou que são potenciais para melhorar ou resolvê-las. Por exemplo, se a necessidade for uma creche, os públicos-alvo são crianças de 0 a 3 anos e suas mães e pais.",title:"O que são os públicos-alvo?"},"project:promote":{body:"Para dar visibilidade ao projeto, mobilizar usuários colaboradores e a comunidade na resolução das problemáticas.",title:"Por que promover o projeto?"},"need:what_is":{body:"Necessidade é qualquer problema social, de maior ou menor complexidade, enfrentada em uma comunidade: desde buracos na rua até necessidade de ações de enfrentamento à violência contra crianças e adolescentes etc.",title:'O que é uma "necessidade"?'},"user:policy":{body:"Todos os dados inseridos por você em seu cadastro estão públicos na plataforma, exceto a senha e seu e-mail.",title:"Há uma política de segurança dos dados?"},"home:objects":{body:"Objetos são comunidades, organizações, necessidades, recursos e investimentos.",title:"O que são os objetos no MootiroMaps?"},"need:why":{body:"Para moradores e atores sociais consigam compreender a dimensão das problemáticas existentes no território.",title:"Por que cadastrar uma necessidade no MootiroMaps?"},"map:addres_coordinate_search":{body:'Você pode navegar até um local no mapa usando seu endereço ou sua coordenada geográfica. Se for endereço, insira no campo em branco informações como rua, número, distrito ou município, CEP. Se preferir coordenadas, coloque a latitude e a longitude.  Depois clique em "Ir".',title:"Como usar o campo de endereço/coordendas?"},"community:description":{body:"Informações como localização, infra-estrutura, histórico, população, perfil sócio-econômico, economia, características principais, fontes das informações (site da prefeitura etc.)",title:'O que devo escrever no campo da "descrição"?'},"home:objects_edition":{body:'O ícone [[[tal]]] indica a edição na página de cada objeto cadastrado. Basta clicar, realizar a edição e clicar no botão "enviar".',title:"Como edito as informações nos cadastros dos objetos no MootiroMaps?"},"map:layers":{body:'O botão "Camadas" é utilizado para escolher e visualizar tipos específicos de objetos no mapa, por exemplo, somente as organizações, somente as comunidades, etc. ',title:'O que são as "Camadas"?'},"map:add":{body:'Clicando no botão "Adicionar" o usuário pode mapear (adicionar) um objeto ao mapa.',title:'O que significa "Adicionar"?'},"organization:target_audience":{body:"São grupos de pessoas atendidas pelas organizações. Exemplo: crianças (0-3), idosos, estudantes etc.",title:"O que são os públicos-alvo?"},"organization:description":{body:"Informações como localização, temática de atuação, serviços oferecidos, histórico, participações em redes e alianças, parceiros, CNPJ, financiamento, gestores, fontes das informações etc.",title:'Que tipo de informações devo adicionar ao campo "descrição"?'},"investment:description":{body:"Nome e descrição do projeto, da necessidade que o investimento apoia, financiador, objetivos e resultados do investimento ou do projeto apoiado etc.",title:'Que tipo de informações devo adicionar ao campo "descrição"?'},"resource:description":{body:"Informações como localização, temática da atuação, serviços oferecidos, organizações conveniadas ou órgãos superiores, financiamento, fontes das informações etc.",title:'Que tipo de informações devo adicionar ao campo "descrição"?'}},e.prototype.tours_config={home:{slides:[{title:gettext("MootiroMaps"),body:gettext("Clique no logo do MootiroMaps e você será redirecionado para a página central."),selector:"#logo"},{title:gettext("Login"),body:gettext("Para criar um perfil no MootiroMaps ou logar na plataforma, clique aqui."),selector:"#login_button",options:"tipLocation:left;nubPosition:top-right;",offsetX:-230},{title:gettext("Página do usuário"),body:gettext("Clicando no nome de qualquer usuário você encontra informações sobre o usuário, contatos e últimas edições feitas."),selector:"#user_menu",options:"tipLocation:left;nubPosition:top-right;",offsetX:-90},{title:gettext("Visualize o mapa"),body:gettext("Aqui você encontra no mapa os objetos já mapeados - no Brasil e no mundo!"),selector:"#menu .map"},{title:gettext("Objetos cadastrados"),body:gettext("Escolha o tipo de objeto cadastrado e veja as listas correspondentes."),selector:"#menu .objects"},{title:gettext("Projetos cadastrados"),body:gettext("Visualize a lista de projetos de mapeamento acontecendo no MootiroMaps."),selector:"#menu .projects"},{title:gettext("Blog do IT3S"),body:gettext("Em nosso Blog postamos análises e opinões sobre transparência, mobilização social, georreferenciamento, tecnologias e colaboração. Clique, leia e comente."),selector:".news .blog",options:"tipLocation:left;"},{title:gettext("Edições recentes"),body:gettext("Acompanhe as atualizações feitas pelos usuários do MootiroMaps. Os ícones mostram os tipos de objetos editados. Edite você também."),selector:".news .last_updates",options:"tipLocation:right;"}]},map:{slides:[{title:gettext("Localização do ponto"),body:gettext("Escolha entre endereço (insira rua, número, município ou insira o CEP) ou coordenada (latitude e longitude) para ser direcionado a um ponto no mapa."),selector:"#map-searchbox"},{title:gettext("Filtrar por raio"),body:gettext("Selecione um ponto no mapa e estabeleça a distância (raio) em que deseja que apareçam os objetos mapeados no território."),selector:"#map-panel-filter-tab"},{title:gettext("Adicionar um objeto"),body:gettext('Escolha o tipo de objeto que melhor se aplica ao que será mapeado e adicione ao mapa uma linha, um ponto ou uma área. Conclua o mapeamento pressionando o botão "avançar".'),selector:"#map-panel-add-tab"},{title:gettext("Filtrar por camada"),body:gettext("Ligue ou desligue as camada para filtrar os objetos a serem apresentados no mapa."),selector:"#map-panel-layers-tab"}]},community_list:{slides:[{title:gettext("Lista de comunidades"),body:gettext("Aqui estão listadas  com uma curta descrição todas as comunidades cadastradas no MootiroMaps. Clique no nome da comunidade para acessar o cadastro completo."),selector:"div.view-list-item > h4 > span > a"},{title:gettext("Ponto no mapa"),body:gettext("Clique para visualizar previamente o objeto no mapa."),selector:"div.view-list-item > h4 > a.list-map-preview",options:"tipLocation:right;",offsetY:-20},{title:gettext("Visualização e filtragem"),body:gettext("Você pode escolher como deseja visualizar a listagem: por ordem alfabética ou data de cadastro. Também pode filtrar por palavras-chave."),selector:"div.view-list-visualization-header i",options:"tipLocation:right;",offsetX:20,offsetY:-28}]},organization_list:{slides:[{title:gettext("Lista de organizações"),body:gettext("Aqui estão listadas com uma curta descrição todas as organizações cadastradas no MootiroMaps. Clique no nome da organização para acessar o cadastro completo."),selector:"div.view-list-item a.org-list-name"},{title:gettext("Visualização e filtragem"),body:gettext("Você pode escolher como deseja visualizar a listagem: por ordem alfabética ou data de cadastro. Também pode filtrar por palavras-chave."),selector:"div.view-list-visualization-header i",options:"tipLocation:right;",offsetX:20,offsetY:-28},{title:gettext("Adicionar uma organização"),body:gettext("Clique aqui e cadastre no MootiroMaps uma nova organização."),selector:"div.button-new"}]},need_list:{slides:[{title:gettext("Lista de necessidades"),body:gettext("Aqui estão listadas com uma curta descrição todas as necessidades cadastradas no MootiroMaps. Clique no nome da necessidade para acessar o cadastro completo."),selector:"div.view-list-item > h4 > span > a"},{title:gettext("Ponto no mapa"),body:gettext("Clique para visualizar previamente o objeto no mapa."),selector:"div.view-list-item > h4 > a.list-map-preview",options:"tipLocation:right;",offsetY:-20},{title:gettext("Visualização e filtragem"),body:gettext("Você pode escolher como deseja visualizar a listagem: por ordem alfabética ou data de cadastro. Também pode filtrar por palavras-chave."),selector:"div.view-list-visualization-header i",options:"tipLocation:right;",offsetX:20,offsetY:-28},{title:gettext("Adicionar uma necessidade"),body:gettext("Clique aqui e cadastre no MootiroMaps uma nova necessidade."),selector:"div.button-new"}]},resource_list:{slides:[{title:gettext("Lista de recursos"),body:gettext("Aqui estão listados com uma curta descrição todos os recursos cadastrados no MootiroMaps. Clique no nome do recurso para acessar o cadastro completo."),selector:"div.view-list-item > h4 > span > a"},{title:gettext("Ponto no mapa"),body:gettext("Clique aqui para visualizar previamente o objeto desejado no mapa."),selector:"div.view-list-item > h4 > a.list-map-preview",options:"tipLocation:right;",offsetY:-20},{title:gettext("Visualização e filtragem"),body:gettext("Você pode escolher como deseja visualizar a listagem: por ordem alfabética ou data de cadastro. Também pode filtrar por palavras-chave."),selector:"div.view-list-visualization-header i",options:"tipLocation:right;",offsetX:20,offsetY:-28},{title:gettext("Adicionar um recurso"),body:gettext("Clique aqui e cadastre no MootiroMaps um novo recurso."),selector:"div.button-new"}]},investment_list:{slides:[{title:gettext("Lista de investimentos"),body:gettext("Aqui estão listados  com uma curta descrição todos os investimentos cadastrados no MootiroMaps. Clique no nome do investimentos para acessar o cadastro completo."),selector:"div.view-list-item > h4 > span > a"},{title:gettext("Ponto no mapa"),body:gettext("Clique aqui para visualizar previamente o objeto no mapa."),selector:"div.view-list-item > h4 > a.list-map-preview",options:"tipLocation:right;",offsetY:-20},{title:gettext("Visualização e filtragem"),body:gettext("Você pode escolher como deseja visualizar a listagem: por ordem alfabética ou data de cadastro. Também pode filtrar por palavras-chave."),selector:"div.view-list-visualization-header",options:"tipLocation:right;",offsetX:20}]},project_list:{slides:[{title:gettext("Lista de projetos"),body:gettext("Aqui estão listados com uma curta descrição todos os projetos cadastrados no MootiroMaps. Clique no nome do projetos para acessar o cadastro completo."),selector:"div.view-list-item span > a"},{title:gettext("Visualização e filtragem"),body:gettext("Você pode filtrar a busca por palavras-chave."),selector:"div.view-list-visualization-header i",options:"tipLocation:right;",offsetX:20,offsetY:-28},{title:gettext("Adicionar um projeto"),body:gettext("Clique aqui e comece um novo projeto de mapeamento no MootiroMaps."),selector:"div.button-new"}]},community_show:{slides:[{title:gettext("Título da comunidade"),body:gettext("Este é o nome com o qual o território foi cadastrado."),selector:".main-column h2.title"},{title:gettext("Edição do conteúdo"),body:gettext("Para editar conteúdos clique no lápis."),selector:"div.view-edit-btn",options:"tipLocation:bottom;nubPosition:top-right;",offsetX:-135},{title:gettext("Perfil da comunidade"),body:gettext("Esse local contém a descrição da comunidade, como a localização, histórico, perfil socioeconômico da população etc."),selector:".main-column .mark-down",options:"tipLocation:left;"},{title:gettext("No mapa"),body:gettext("Clique aqui se você quiser visualizar a comunidade em um mapa maior."),selector:"#map-preview",options:"tipLocation:left;"},{title:gettext("Comunidades próximas"),body:gettext("O campo mostra outras comunidades cadastradas no MootiroMaps que estão próximas a esta."),selector:".right-bar .nearby-communities",options:"tipLocation:left;"},{title:gettext("Seguir"),body:gettext('Clicando no botão "seguir" você assina as atualizações do conteúdo e recebe atualizações sempre que ele for alterado.'),selector:".view-follow-btns",options:""},{title:gettext("Comentar"),body:gettext("O que você acha desse local? Qual a sua opinião? Deixe um comentário na página."),selector:"#divFormComment",options:"tipLocation:bottom;"},{title:gettext("Redes sociais"),body:gettext("Gostou do conteúdo dessa página? Divulgue-a nas redes sociais."),selector:".fb-like",options:"tipLocation:bottom;"}]},organization_show:{slides:[{title:gettext("Título da organização"),body:gettext("Este é o nome com o qual a organização foi cadastrada."),selector:".organization-header"},{title:gettext("Edição do conteúdo"),body:gettext("Para editar conteúdos clique no lápis."),selector:"div.view-edit-btn",options:"tipLocation:bottom;nubPosition:top-right;",offsetX:-135},{title:gettext("Descrição da organização"),body:gettext("Esse local contém a descrição da organização, como temática de atuação, objetivos, projetos e serviços, parceiros, financiadores etc."),selector:".main-column .mark-down",options:"tipLocation:left;"},{title:gettext("No mapa"),body:gettext("Clique aqui se você quiser visualizar a organização em um mapa maior."),selector:"#map-preview",options:"tipLocation:left;"},{title:gettext("Projetos"),body:gettext("O campo apresenta a quais projetos de mapeamento esta organização está relacionada."),selector:".projects-tag-header",options:"tipLocation:left;"},{title:gettext("Seguir"),body:gettext('Clicando no botão "seguir" você assina as atualizações do conteúdo e recebe atualizações sempre que ele for alterado.'),selector:".view-follow-btns",options:""},{title:gettext("Comentar"),body:gettext("O que você acha desse local? Qual a sua opinião? Deixe um comentário na página."),selector:"#divFormComment",options:"tipLocation:bottom;"},{title:gettext("Redes sociais"),body:gettext("Gostou da organização? Divulgue-a nas redes sociais."),selector:".fb-like",options:"tipLocation:bottom;"}]},need_show:{slides:[{title:gettext("Título da necessidade"),body:gettext("Este é o nome com o qual a necessidade foi cadastrada."),selector:".need-title"},{title:gettext("Edição do conteúdo"),body:gettext("Para editar conteúdos clique no lápis."),selector:"div.view-edit-btn",options:"tipLocation:bottom;nubPosition:top-right;",offsetX:-135},{title:gettext("Descrição da necessidade"),body:gettext("Esse local contém a descrição da necessidade e permite que os usuários consigam compreender a natureza da problemática."),selector:".main-column .mark-down",options:"tipLocation:right;"},{title:gettext("No mapa"),body:gettext("Clique aqui se você quiser visualizar a necessidade em um mapa maior."),selector:"#map-preview",options:"tipLocation:left;"},{title:gettext("Proposta de resolução"),body:gettext("Neste campo é possível inserir novas propostas de resolução da necessidade."),selector:".need-proposals",options:"tipLocation:left;"},{title:gettext("Necessidades semelhantes"),body:gettext("O MootiroMaps relaciona necessidades semelhantes ou próximas para facilitar que os usuários troquem experiências e discutam como resolvê-las."),selector:"#related-needs",options:"tipLocation:left;"},{title:gettext("Seguir"),body:gettext('Clicando no botão "seguir" você assina as atualizações do conteúdo e recebe atualizações sempre que ele for alterado.'),selector:".view-follow-btns",options:""},{title:gettext("Comentar"),body:gettext("O que você acha desse local? Qual a sua opinião? Deixe um comentário na página."),selector:"#divFormComment",options:"tipLocation:bottom;"},{title:gettext("Redes sociais"),body:gettext("Achou importante a necessidade? Divulgue-a nas redes sociais."),selector:".fb-like",options:"tipLocation:bottom;"}]},resource_show:{slides:[{title:gettext("Título do recurso"),body:gettext("Este é o nome com o qual o recurso foi cadastrado."),selector:"h2.title"},{title:gettext("Edição do conteúdo"),body:gettext("Para editar conteúdos clique no lápis."),selector:"div.view-edit-btn",options:"tipLocation:bottom;nubPosition:top-right;",offsetX:-135},{title:gettext("Descrição do recurso"),body:gettext("Esse local contém a descrição do recurso, como localização, horários de atendimento, temática, projetos e serviços etc."),selector:".main-column .mark-down",options:"tipLocation:right;"},{title:gettext("No mapa"),body:gettext("Clique aqui se você quiser visualizar o recurso em um mapa maior."),selector:"#map-preview",options:"tipLocation:left;"},{title:gettext("Recursos semelhantes"),body:gettext("O campo permite que os usuários identifiquem recursos semelhantes ou próximos."),selector:".related-resource",options:"tipLocation:left;",offsetX:-10,offsetY:-25},{title:gettext("Seguir"),body:gettext('Clicando no botão "seguir" você assina as atualizações do conteúdo e recebe atualizações sempre que ele for alterado.'),selector:".view-follow-btns",options:""},{title:gettext("Comentar"),body:gettext("O que você acha desse local? Qual a sua opinião? Deixe um comentário na página."),selector:"#divFormComment",options:"tipLocation:bottom;"},{title:gettext("Redes sociais"),body:gettext("Gostou da página? Divulgue-a nas redes sociais."),selector:".fb-like",options:"tipLocation:bottom;"}]},investment_show:{slides:[{title:gettext("Título do investimento"),body:gettext("Este é o nome com o qual o investimento foi cadastrado."),selector:"h2.title"},{title:gettext("Edição do conteúdo"),body:gettext("Para editar conteúdos clique no lápis."),selector:"div.view-edit-btn",options:"tipLocation:bottom;nubPosition:top-right;",offsetX:-135},{title:gettext("Descrição do investimento"),body:gettext("O preenchimento deste campo mostra a descrição do investimento, como o objetivo, localização, temática, público-alvo etc."),selector:".main-column .mark-down",options:"tipLocation:right;"},{title:gettext("Seguir"),body:gettext('Clicando no botão "seguir" você assina as atualizações do conteúdo e recebe atualizações sempre que ele for alterado.'),selector:".view-follow-btns",options:""},{title:gettext("Comentar"),body:gettext("O que você acha desse investimento? Qual a sua opinião? Deixe um comentário na página."),selector:"#divFormComment",options:"tipLocation:bottom;"},{title:gettext("Redes sociais"),body:gettext("Achou importante essa informação? Divulgue-a nas redes sociais."),selector:".fb-like",options:"tipLocation:bottom;"}]},project_show:{slides:[{title:gettext("Título do projeto"),body:gettext("Este é o nome com o qual o projeto foi cadastrado."),selector:"h2.title"},{title:gettext("Edição do conteúdo"),body:gettext("Para editar conteúdos clique no lápis."),selector:"div.view-edit-btn",options:"tipLocation:bottom;nubPosition:top-right;",offsetX:-135},{title:gettext("Descrição do projeto"),body:gettext("Esse local contém a descrição do projeto, como o objetivo, localização, temática, público-alvo, apoiadores etc."),selector:".main-column .mark-down",options:"tipLocation:right;"},{title:gettext("Objetos relacionados"),body:gettext("A listagem mostra objetos (organizações, recursos, necessidades etc) que foram cadastrados e relacionados a esse projeto."),selector:".view-info-buttons",options:"tipLocation:top;",offsetX:50},{title:gettext("No mapa"),body:gettext("Clique aqui se você quiser visualizar todos os objetos relacionados ao projeto em um mapa maior."),selector:"#map-preview",options:"tipLocation:left;"},{title:gettext("Participantes"),body:gettext("O campo mostra o usuário administrador e os colaboradores."),selector:".view-info-btn:last"},{title:gettext("Seguir"),body:gettext('Clicando no botão "seguir" você assina as atualizações do conteúdo e recebe atualizações sempre que ele for alterado.'),selector:".view-follow-btns",options:""},{title:gettext("Comentar"),body:gettext("O que você acha desse local? Qual a sua opinião? Deixe um comentário na página."),selector:"#divFormComment",options:"tipLocation:bottom;"},{title:gettext("Redes sociais"),body:gettext("Gostou do projeto? Divulgue-o nas redes sociais."),selector:".fb-like",options:"tipLocation:bottom;"}]}},e}(),window.HelpCenter=HelpCenter;