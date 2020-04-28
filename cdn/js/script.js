$(function () {
  getPhotoFromGithub()
  getActivities()
})


const getActivities = async () => {
  const { data } = await axios.get('https://spreadsheets.google.com/feeds/cells/1wlVnRTw2siwU5r3Jd77tNfpJoAFfOsvcSSYLsrqIjV0/1/public/values?alt=json')
  const cells = data.feed.entry
  const rows = _.groupBy(cells, (obj) => obj['gs$cell'].row)

  for (row in rows) {
    if (row === '1') continue
    const isFirst = row === '2'

    console.log(rows[row]);

    const dataItem = rows[row]
    const getCellValueByColumn = (cell) => _.filter(dataItem, (row) => row['gs$cell'].col === `${cell}`)[0]?.content['$t'] ?? undefined
  
    const responsibleAuthor = getCellValueByColumn(1)
    const title = getCellValueByColumn(2)
    const abbreviation = getCellValueByColumn(3)
    const startDate = getCellValueByColumn(4)
    const endDate = getCellValueByColumn(5)
    const time = getCellValueByColumn(6)
    const location = getCellValueByColumn(7)
    const description = getCellValueByColumn(8)
    const team = getCellValueByColumn(9) ?? 'Não definido'
    const externalLink = getCellValueByColumn(10)
    const linkForm = getCellValueByColumn(11)
    const isActive = getCellValueByColumn(12).toLowerCase() === 'true' ? true : false

    if(!isActive) continue

    const teamBadge = team.split(',').map(user => `<span class="badge theme-primary">${user.trim()}</span> `)

    const activityDate = (startDate && !endDate || startDate === endDate) 
    ? `O evento será realizado no dia ${startDate} de ${time}.`
    : `O evento será realizado entre os dias ${startDate} e ${endDate} de ${time}.`

    const item = `<div class="carousel-item ${isFirst ? 'active' : ''}"><div class="py-4 mt-5"><blockquote class="blockquote blockquote-custom bg-white text-dark p-5 shadow rounded display-flex"><div class="blockquote-custom-icon bg-theme shadow-sm"><i class="fa fa-quote-left text-white"></i></div><h5>[${abbreviation}] ${title} </h5><p class="mb-0 mt-2 font-italic">"${description}" ${externalLink ? `<a href="//${externalLink}" class="text-info">Saiba mais...</a>` : '' }</p>${linkForm ? `<a href="//${linkForm}" target="_blank" type="button" class="btn btn-primary float-md-right float-sm-none mt-1">Inscrever</a>` : ''} <div class="blockquote-footer pt-4 mt-4 border-top"><span>${activityDate} ${location}</span> <div class="mt-3"> <cite>Equipe responsável </cite> <div class="h5"> ${teamBadge.join('')} </div> </div> </div> </blockquote> </div></div>`
    $('#news-carousel-items').append(item)
    $('#news-carousel-container').removeClass('d-none')

    const indicator = `<li data-target="#news-carousel" data-slide-to="${row - 2}" class="${isFirst ? 'active' : ''}"></li>`
    $('#news-carousel-indicators').append(indicator)
  }
}

var typed_header = new Typed('#autotype_header', {
  strings: ["UNIPAMPA", "CoffeeHack", "EnglishHack", "CineHack", "TchêHack", "Hackaton", "EscolaHack", "InfoHack", "InterClubHack", "IdentificaHack", "ResolveHack", "InovaHack"],
  typeSpeed: 75,
  backSpeed: 30,
  loop: true
});

var typed_logo = new Typed('#autotype_logo', {
  strings: ["Clube Universidade Hacker"],
  typeSpeed: 100,
  loop: false,
  showCursor: true,
  cursorChar: '▮',
});

particlesConfig = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#9acc14'
    },
    shape: {
      type: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      polygon: {
        nb_sides: 5
      },
      image: {
        src: 'img/github.svg',
        width: 100,
        height: 100
      }
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: {
        enable: false,
        speed: 0.5,
        opacity_min: 0.1,
        sync: false
      }
    },
    size: {
      value: 1,
      random: true,
      anim: {
        enable: false,
        speed: 40,
        size_min: 0.1,
        sync: false
      }
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#5bc117',
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 3,
      direction: 'right',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detect_on: 'window',
    events: {
      onhover: {
        enable: true,
        mode: 'repulse'
      },
      onclick: {
        enable: false,
        mode: 'push'
      },
      resize: true
    },
    modes: {
      grab: {
        distance: 10,
        line_linked: {
          opacity: 1
        }
      },
      bubble: {
        distance: 10,
        size: 40,
        duration: 2,
        opacity: 8,
        speed: 3
      },
      repulse: {
        distance: 100,
        duration: 0.4
      },
      push: {
        particles_nb: 4
      },
      remove: {
        particles_nb: 2
      }
    }
  },
  retina_detect: true
}

particlesJS('particles-js', particlesConfig);

$('#equipe [data-toggle=tooltip]').tooltip({
  template: '<div class="tooltip mb-2" role="tooltip"><div class="arrow arrow-down-tooltip"></div><div class="tooltip-inner tooltip-parallelogram equipe"></div></div>',
  html: true
})

const getPhotoFromGithub = () => {
  $('img[data-github-photo]').each(function () {
    let githubUser = $(this).data('github-photo');

    if (!githubUser) {
      return
    }

    axios.get(`https://api.github.com/users/${githubUser}`)
      .then(({ data }) => {
        $(this).attr('src', data.avatar_url)
      })
      .catch(e => {
      })
  })
}
