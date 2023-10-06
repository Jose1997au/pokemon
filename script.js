// Returns JSON()
const make_request = (method, url) => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
    
        request.open(method, url, true);
    
        request.onload = function() {
    
          if (this.response == "Not Found") {
            resolve(1);
          } else {
            const data = JSON.parse(this.response);
    
             if (request.status >= 200 && request.status < 400) {
               resolve(data);
             } else {
               resolve(4);
             }
          }
        
        }
  
        request.onerror = function() {
          reject(new Error("Network Error"));
        };
  
        request.send();
    });
  }
  
  const show_poke_info = () => {
    $('.parent').removeClass('hidden');
  }
  
  const hide_poke_info = () => {
    $('.parent').addClass('hidden');
  }
  
  const show_spinner = () => {
    $('.fi-xnsus5-loading').show();
  }
  
  const hide_spinner = () => {
    $('.fi-xnsus5-loading').hide();
  }
  
  const verify = (data) => {
    if (data == 1 || data == 4) {
      return false;
    } else {
      return true;
    }
  }
  
  const create_ability_template = (name) => {
    const abilityDiv = document.createElement('div');
    abilityDiv.classList.add('ability');
  
    const abilityP = document.createElement('p');
    abilityP.textContent = name;
  
    abilityDiv.append(abilityP);
  
    return abilityDiv;
  }
  
  /* Wanted data
  1. Abilites
  2. Sprite
  3. Base Happiness
  4. Capture rate
  5. Evolves from
  */
  
  const filter_data = (data) => {
    // Return dictionairy for easy data display
    return {
      "sprite": data?.sprites?.front_default,
      "abilities": data?.abilities,
      "base_happiness": data?.base_happiness,
      "capture_rate": data?.capture_rate,
      "evolves_from": data?.evolves_from_species?.name
    };
  }
  
  const on_click = async () => {
    $('.error-info').hide()
    show_spinner();
    hide_poke_info();
    const pokemon = $('.pokemon').val().toLowerCase();
  
    try {
      const URL = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
      const poke_data = await make_request('GET', URL);
      const next_poke_data = poke_data ? await make_request('GET', poke_data['species']['url']) : null;
      
      const data1_verified = verify(poke_data);
      const data2_verified = verify(next_poke_data);
      
      if (data1_verified && data2_verified) {  
        const data1_filtered = filter_data(poke_data);
        const data2_filtered = filter_data(next_poke_data);
        
        const new_str = pokemon.charAt(0).toUpperCase() + pokemon.slice(1);
        
        $('#poke-name').text(`${new_str}`);
        
        // Group 1 data handling
        $('#poke-img').attr('src', data1_filtered?.sprite);
        $('#evolves-from').text(`Evolves from: ${data2_filtered?.evolves_from ? data2_filtered?.evolves_from.charAt(0).toUpperCase() + data2_filtered?.evolves_from.slice(1) : "None"}`);
  
        // Group 2 data handling
        $('#bh').text(`${data2_filtered?.base_happiness}/100`);
        $('#cr').text(`${data2_filtered?.capture_rate}`);
        $('#base-happiness').attr('value', data2_filtered?.base_happiness);
        $('#capture-rate').attr('value', data2_filtered?.capture_rate);
  
        // Group 3 data handling
        const group3 = $('.a-conatiner');
        group3.empty();
        for (let i = 0 ; i < data1_filtered?.abilities.length ; i++) {
          const ability = data1_filtered.abilities[i].ability.name
          const ability_name = ability.charAt(0).toUpperCase() + ability.slice(1);
          const new_element = create_ability_template(ability_name)
          group3.append(new_element);
        }
  
        setTimeout(() => {
          hide_spinner();
          show_poke_info();
        }, 1000)
        
      }
    } catch(err) {
      hide_spinner();
      console.error(err);
      $('.error-info').show()
    }
  }