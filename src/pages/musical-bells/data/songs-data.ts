export interface Song {
  title: string;
  notes: string[];
  lyrics: string[];
  description: string;
}

// Define complete songs with consistent structure for notes and lyrics
export const songs: Song[] = [
  {
    title: "Brilha, Brilha Estrelinha",
    notes: ["C1", "C1", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C1", "G", "G", "F", "F", "E", "E", "D", "G", "G", "F", "F", "E", "E", "D", "C1", "C1", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C1"],
    lyrics: ["Bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar", "lá", "no", "céu", "tão", "al", "ti", "nho", "faz", "pa", "re", "cer", "um", "dia", "man", "ti", "nho", "bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar"],
    description: "Uma canção infantil clássica, também conhecida como 'Twinkle Twinkle Little Star', com todas as estrofes completas."
  },
  {
    title: "Parabéns a Você",
    notes: ["C1", "C1", "D", "C1", "F", "E", "C1", "C1", "D", "C1", "G", "F", "C1", "C1", "C8", "A", "F", "E", "D", "B", "B", "A", "F", "G", "F"],
    lyrics: ["Pa", "ra", "béns", "a", "vo", "cê", "nes", "ta", "da", "ta", "que", "ri", "da", "mui", "tas", "fe", "li", "ci", "da", "des", "mui", "tos", "a", "nos", "de", "vi", "da"],
    description: "A canção tradicional de aniversário completa, com todas as estrofes."
  },
  {
    title: "Dó-Ré-Mi",
    notes: ["C1", "D", "E", "F", "G", "A", "B", "C8", "C1", "D", "E", "F", "G", "A", "B", "C8"],
    lyrics: ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó", "es", "ca", "la", "mu", "si", "cal", "com", "ple", "ta"],
    description: "A famosa escala musical completa, ascendente e descendente."
  },
  {
    title: "Ode à Alegria",
    notes: ["E", "E", "F", "G", "G", "F", "E", "D", "C1", "C1", "D", "E", "E", "D", "D", "E", "E", "F", "G", "G", "F", "E", "D", "C1", "C1", "D", "E", "D", "C1", "C1"],
    lyrics: ["O", "de", "à", "a", "le", "gri", "a", "be", "la", "cen", "te", "lha", "di", "vi", "na", "fi", "lha", "do", "E", "lí", "seo", "ce", "les", "ti", "al", "tu", "a", "ma", "gi", "a"],
    description: "Melodia principal da Nona Sinfonia de Beethoven, com estrofes completas."
  },
  {
    title: "Escala Cromática",
    notes: ["C1", "D", "E", "F", "G", "A", "B", "C8", "B", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Su", "bin", "do", "a", "es", "ca", "la", "mú", "si", "cal", "des", "cen", "do", "a", "gora"],
    description: "Uma escala que percorre todas as notas em sequência, subindo e descendo."
  },
  {
    title: "Ciranda, Cirandinha",
    notes: ["C1", "D", "E", "C1", "D", "E", "C1", "E", "D", "C1", "D", "E", "C1", "D", "D", "E", "F", "F", "E", "D", "C1"],
    lyrics: ["Ci", "ran", "da", "ci", "ran", "di", "nha", "va", "mos", "to", "dos", "ci", "ran", "dar", "o", "a", "nel", "que", "tu", "me", "des", "te"],
    description: "Canção folclórica brasileira muito popular entre crianças, com versos completos."
  },
  {
    title: "Marcha Soldado",
    notes: ["E", "E", "E", "G", "C1", "C1", "G", "G", "E", "E", "C1", "E", "E", "E", "G", "C1", "C1", "G", "G", "E", "E", "C1"],
    lyrics: ["Mar", "cha", "sol", "da", "do", "ca", "be", "ça", "de", "pa", "pel", "se", "não", "mar", "char", "di", "rei", "ti", "nho", "vai", "pre", "so"],
    description: "Canção infantil brasileira tradicional com todos os versos."
  },
  {
    title: "O Sapo Não Lava o Pé",
    notes: ["G", "A", "G", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G"],
    lyrics: ["O", "sa", "po", "não", "la", "va", "o", "pé", "não", "la", "va", "por", "que", "não", "e", "le", "mo", "ra", "lá", "na", "la", "go", "a", "não", "la", "va", "o", "pé"],
    description: "Canção infantil brasileira divertida e educativa, com todos os versos."
  },
  {
    title: "Frère Jacques",
    notes: ["C1", "D", "E", "C1", "C1", "D", "E", "C1", "E", "F", "G", "E", "F", "G", "G", "A", "G", "F", "E", "C1", "G", "G", "A", "G", "F", "E", "C1"],
    lyrics: ["Frè", "re", "Jac", "ques", "Frè", "re", "Jac", "ques", "Dor", "mez", "vous", "Dor", "mez", "vous", "Son", "nez", "les", "ma", "ti", "nes", "Son", "nez", "les", "ma", "ti", "nes", "Din", "din", "don"],
    description: "Canção de origem francesa conhecida em todo o mundo, com todos os versos."
  },
  {
    title: "Escravos de Jó",
    notes: ["G", "G", "G", "E", "G", "G", "G", "E", "G", "E", "C1", "C1", "A", "A", "G", "G", "G", "G", "E", "G", "G", "G", "E", "G", "E", "C1", "C1", "A", "A", "G"],
    lyrics: ["Es", "cra", "vos", "de", "Jó", "jo", "ga", "vam", "ca", "xan", "gá", "ti", "ra", "ti", "ra", "bo", "ta", "dei", "xa", "fi", "car", "guer", "rei", "ros", "com", "guer", "rei", "ros", "fa", "zem"],
    description: "Música folclórica brasileira usada em jogos infantis, com todos os versos."
  },
  {
    title: "Cai, Cai, Balão",
    notes: ["G", "E", "G", "E", "C1", "G", "F", "E", "D", "C1", "G", "E", "G", "E", "C1", "G", "F", "E", "D", "C1", "C1", "D", "E", "F", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Cai", "cai", "ba", "lão", "cai", "cai", "ba", "lão", "a", "qui", "na", "mi", "nha", "mão", "não", "cai", "não", "não", "não", "não", "cai", "a", "qui", "na", "mi", "nha", "mão", "mão", "mão", "mão", "mão"],
    description: "Canção tradicional das festas juninas no Brasil, com todos os versos."
  },
  {
    title: "A Canoa Virou",
    notes: ["E", "G", "C1", "G", "E", "G", "C1", "G", "C1", "B", "A", "G", "F", "E", "E", "G", "C1", "G", "E", "G", "C1", "G", "C1", "B", "A", "G", "F", "E"],
    lyrics: ["A", "ca", "no", "a", "vi", "rou", "por", "dei", "xar", "e", "la", "vi", "rar", "foi", "por", "cau", "sa", "do", "Ma", "ri", "a", "que", "não", "sou", "be", "re", "mar"],
    description: "Canção folclórica brasileira completa com todos os versos."
  },
  {
    title: "Eu Vi Uma Barata",
    notes: ["C1", "C1", "D", "E", "C1", "E", "D", "C1", "C1", "D", "E", "C1", "C1", "C1", "D", "E", "C1", "E", "D", "C1", "C1", "D", "E", "C1"],
    lyrics: ["Eu", "vi", "u", "ma", "ba", "ra", "ta", "na", "ca", "re", "ca", "do", "ve", "lho", "pa", "dre", "an", "tô", "nio", "sai", "ba", "ra", "ta", "dei"],
    description: "Canção infantil brasileira simples e divertida, com todos os versos."
  },
  {
    title: "Se Esta Rua Fosse Minha",
    notes: ["C1", "E", "F", "G", "G", "F", "E", "D", "C1", "E", "G", "C1", "C1", "E", "F", "G", "G", "F", "E", "D", "C1", "E", "G", "C1", "G", "G", "A", "G", "F", "E", "D", "C1", "D", "E", "F"],
    lyrics: ["Se", "es", "ta", "ru", "a", "fos", "se", "mi", "nha", "eu", "man", "da", "va", "la", "dri", "lhar", "com", "pe", "dri", "nhas", "de", "bri", "lhan", "te", "pa", "ra", "o", "meu", "a", "mor", "pas", "sar"],
    description: "Canção de ninar tradicional brasileira completa."
  },
  {
    title: "Borboletinha",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "F", "E", "D", "C1", "G", "F", "E", "D"],
    lyrics: ["Bor", "bo", "le", "ti", "nha", "tá", "na", "co", "zi", "nha", "fa", "zen", "do", "cho", "co", "la", "te", "pa", "ra", "ma", "dri", "nha", "po", "ti", "po", "ti", "po", "ti"],
    description: "Canção infantil brasileira muito popular em escolas, com todos os versos."
  },
  {
    title: "Jingle Bells",
    notes: ["E", "E", "E", "E", "E", "E", "E", "G", "C1", "D", "E", "F", "F", "F", "F", "F", "E", "E", "E", "E", "D", "D", "E", "D", "G"],
    lyrics: ["Jin", "gle", "bells", "jin", "gle", "bells", "jin", "gle", "all", "the", "way", "oh", "what", "fun", "it", "is", "to", "ride", "in", "a", "one", "horse", "o", "pen", "sleigh"],
    description: "Música natalina conhecida mundialmente, com todos os versos do refrão."
  },
  {
    title: "Atirei o Pau no Gato",
    notes: ["G", "E", "E", "F", "G", "G", "G", "A", "G", "F", "E", "D", "C1", "G", "E", "E", "F", "G", "G", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["A", "ti", "rei", "o", "pau", "no", "ga", "to", "to", "mas", "o", "ga", "to", "não", "mor", "reu", "reu", "reu", "do", "na", "chi", "ca", "ca", "ad", "mi", "rou"],
    description: "Canção infantil tradicional brasileira, com todos os versos."
  },
  {
    title: "Caranguejo",
    notes: ["C1", "C1", "A", "A", "G", "G", "E", "G", "A", "G", "F", "E", "C1", "C1", "A", "A", "G", "G", "E", "G", "A", "G", "F", "E"],
    lyrics: ["Ca", "ran", "gue", "jo", "não", "é", "pei", "xe", "ca", "ran", "gue", "jo", "pei", "xe", "é", "na", "va", "zi", "a", "ni", "ma", "ré"],
    description: "Música folclórica brasileira popular em brincadeiras infantis, com todos os versos."
  },
  {
    title: "Row, Row, Row Your Boat",
    notes: ["C1", "C1", "C1", "D", "E", "E", "D", "E", "F", "G", "C8", "C8", "C8", "G", "G", "G", "E", "E", "E", "C1", "C1", "C1"],
    lyrics: ["Row", "row", "row", "your", "boat", "gen", "tly", "down", "the", "stream", "mer", "ri", "ly", "mer", "ri", "ly", "mer", "ri", "ly", "mer", "ri", "ly"],
    description: "Canção infantil inglesa tradicional, com todos os versos."
  },
  {
    title: "Samba Lelê",
    notes: ["G", "G", "G", "E", "A", "A", "G", "E", "G", "F", "E", "D", "C1", "G", "G", "G", "E", "A", "A", "G", "E", "G", "F", "E", "D", "C1"],
    lyrics: ["Sam", "ba", "Le", "lê", "es", "tá", "do", "en", "te", "es", "tá", "com", "a", "ca", "be", "ça", "que", "bra", "da", "pre", "ci", "sa", "de", "u", "ma", "ben", "ção"],
    description: "Canção folclórica brasileira muito usada em brincadeiras, com todos os versos."
  },
  {
    title: "London Bridge",
    notes: ["G", "A", "G", "F", "E", "F", "G", "D", "E", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G", "D", "G", "E", "C1"],
    lyrics: ["Lon", "don", "Bridge", "is", "fal", "ling", "down", "fal", "ling", "down", "fal", "ling", "down", "Lon", "don", "Bridge", "is", "fal", "ling", "down", "my", "fair", "la", "dy"],
    description: "Canção tradicional inglesa conhecida mundialmente, com todos os versos."
  },
  {
    title: "Meu Lanchinho",
    notes: ["C1", "D", "E", "C1", "C1", "D", "E", "C1", "E", "F", "G", "E", "F", "G", "C1", "D", "E", "C1", "C1", "D", "E", "C1"],
    lyrics: ["Meu", "lan", "chi", "nho", "meu", "lan", "chi", "nho", "vou", "co", "mer", "pra", "fi", "car", "for", "ti", "nho", "e", "cres", "cer"],
    description: "Canção infantil brasileira cantada na hora do lanche escolar, com todos os versos."
  },
  {
    title: "Pirulito que Bate Bate",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "D", "E", "F", "G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "D", "E", "F"],
    lyrics: ["Pi", "ru", "li", "to", "que", "ba", "te", "ba", "te", "pi", "ru", "li", "to", "que", "já", "ba", "teu", "quem", "gos", "ta", "de", "mim", "é", "e", "la", "quem"],
    description: "Canção folclórica brasileira popular entre crianças, com todos os versos."
  },
  {
    title: "O Cravo e a Rosa",
    notes: ["E", "G", "G", "A", "G", "F", "E", "E", "A", "A", "G", "F", "E", "D", "E", "G", "G", "A", "G", "F", "E", "E", "A", "A", "G", "F", "E", "D"],
    lyrics: ["O", "cra", "vo", "bri", "gou", "com", "a", "ro", "sa", "de", "bai", "xo", "de", "uma", "sa", "cu", "da", "de", "o", "cra", "vo", "sa", "iu", "ma", "chu", "ca", "do"],
    description: "Canção infantil tradicional portuguesa e brasileira, com todos os versos."
  },
  {
    title: "Passarinho que Som é Esse",
    notes: ["G", "G", "E", "G", "A", "A", "G", "F", "E", "D", "C1", "G", "G", "E", "G", "A", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Pas", "sa", "ri", "nho", "que", "som", "é", "es", "se", "que", "tu", "fa", "zes", "quan", "do", "vo", "as", "pe", "lo", "ar", "piu", "piu"],
    description: "Canção educativa brasileira para ensinar sons de animais, com todos os versos."
  },
  {
    title: "Sapo Cururu",
    notes: ["C1", "D", "E", "G", "C1", "D", "E", "G", "E", "F", "G", "A", "G", "F", "E", "D", "C1", "D", "E", "G", "C1", "D", "E", "G"],
    lyrics: ["Sa", "po", "cu", "ru", "ru", "na", "bei", "ra", "do", "ri", "o", "quan", "do", "o", "sa", "po", "can", "ta", "ó", "ma", "na", "é", "por", "que"],
    description: "Canção folclórica brasileira sobre um sapo à beira do rio. Popular entre crianças."
  },
  {
    title: "O Sítio do Seu Lobato",
    notes: ["G", "G", "G", "D", "E", "E", "D", "B", "B", "A", "B", "C1", "G", "G", "G", "D", "E", "E", "D", "B", "B", "A", "B", "C1"],
    lyrics: ["Seu", "Lo", "ba", "to", "ti", "nha", "um", "sí", "tio", "ia", "ia", "ô", "e", "nes", "se", "sí", "tio", "ti", "nha", "um", "ca", "chor", "ro", "au"],
    description: "Canção infantil educativa que apresenta os sons dos animais da fazenda."
  },
  {
    title: "A Barata Diz Que Tem",
    notes: ["E", "E", "F", "G", "G", "F", "E", "D", "E", "E", "F", "G", "G", "F", "E", "D", "D", "D", "E", "F", "E", "D", "C1", "D", "E", "C1"],
    lyrics: ["A", "ba", "ra", "ta", "diz", "que", "tem", "se", "te", "sai", "as", "de", "fi", "ló", "é", "men", "ti", "ra", "da", "ba", "ra", "ta", "e", "la", "tem", "é"],
    description: "Canção folclórica divertida que retrata as mentiras de uma barata sobre suas posses."
  },
  {
    title: "Boi da Cara Preta",
    notes: ["G", "G", "E", "C1", "G", "G", "E", "C1", "C1", "C1", "D", "E", "D", "C1", "B", "A", "G"],
    lyrics: ["Boi", "boi", "boi", "boi", "da", "ca", "ra", "pre", "ta", "pe", "ga", "es", "sa", "cri", "an", "ça", "que"],
    description: "Cantiga de ninar tradicional brasileira, usada para acalmar crianças pequenas."
  },
  {
    title: "Peixe Vivo",
    notes: ["C1", "E", "G", "C1", "E", "G", "A", "G", "F", "E", "D", "C1", "C1", "E", "G", "C1", "E", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Co", "mo", "po", "de", "um", "pei", "xe", "vi", "vo", "vi", "ver", "fo", "ra", "da", "á", "gua", "cla", "ra", "co", "mo", "po", "de", "eu"],
    description: "Canção folclórica brasileira que expressa sentimentos de saudade e pertencimento."
  },
  {
    title: "Indiozinhos",
    notes: ["E", "G", "C1", "E", "G", "C1", "E", "D", "C1", "B", "A", "G", "E", "G", "C1", "E", "G", "C1", "E", "D", "C1", "B", "A", "G"],
    lyrics: ["Um", "dois", "três", "ín", "dios", "zi", "nhos", "qua", "tro", "cin", "co", "seis", "ín", "dios", "zi", "nhos", "se", "te", "oi", "to", "no", "ve", "ín", "dios"],
    description: "Cantiga infantil que ensina os números de forma divertida, contando índios."
  },
  {
    title: "A Linda Rosa Juvenil",
    notes: ["C1", "D", "E", "F", "G", "G", "A", "G", "F", "E", "D", "C1", "C1", "D", "E", "F", "G", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["A", "lin", "da", "ro", "sa", "ju", "ve", "nil", "ju", "ve", "nil", "ju", "ve", "nil", "a", "lin", "da", "ro", "sa", "ju", "ve", "nil", "ju", "ve", "nil"],
    description: "Cantiga infantil tradicional que conta a história de uma linda rosa que adormeceu."
  },
  {
    title: "Capelinha de Melão",
    notes: ["G", "A", "B", "G", "A", "B", "C1", "B", "A", "G", "F", "E", "G", "A", "B", "G", "A", "B", "C1", "B", "A", "G", "F", "E"],
    lyrics: ["Ca", "pe", "li", "nha", "de", "me", "lão", "é", "de", "São", "Jo", "ão", "é", "de", "cra", "vo", "é", "de", "ro", "sa", "é", "de", "man", "je"],
    description: "Canção junina tradicional, cantada durante as festas de São João no Brasil."
  },
  {
    title: "Nesta Rua",
    notes: ["C1", "E", "G", "C1", "B", "A", "G", "E", "G", "F", "E", "D", "C1", "C1", "E", "G", "C1", "B", "A", "G", "E", "G", "F", "E", "D", "C1"],
    lyrics: ["Nes", "ta", "ru", "a", "nes", "ta", "ru", "a", "tem", "um", "bos", "que", "que", "se", "cha", "ma", "se", "cha", "ma", "so", "li", "dão", "den", "tro", "de", "le"],
    description: "Modinha tradicional brasileira que fala sobre sentimentos de amor e solidão."
  },
  {
    title: "O Pintinho Amarelinho",
    notes: ["G", "G", "A", "G", "F", "E", "G", "G", "A", "G", "F", "E", "E", "F", "G", "A", "B", "B", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["O", "pin", "ti", "nho", "a", "ma", "re", "li", "nho", "ca", "be", "ci", "nha", "de", "pa", "pel", "o", "lha", "só", "pra", "ci", "ma", "o", "lha"],
    description: "Canção infantil brasileira que descreve um pintinho amarelinho de forma divertida."
  },
  {
    title: "A Galinha do Vizinho",
    notes: ["E", "G", "C1", "E", "G", "C1", "G", "A", "G", "F", "E", "D", "C1", "E", "G", "C1", "E", "G", "C1", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["A", "ga", "li", "nha", "do", "vi", "zi", "nho", "bo", "ta", "o", "vo", "a", "ma", "re", "li", "nho", "bo", "ta", "a", "qui", "bo", "ta", "a", "co", "lá"],
    description: "Canção infantil brasileira divertida que fala sobre uma galinha e seus ovos."
  },
  {
    title: "O Elefante",
    notes: ["C1", "D", "E", "F", "G", "G", "A", "G", "F", "E", "D", "C1", "C1", "D", "E", "F", "G", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["O", "e", "le", "fan", "te", "é", "pe", "sa", "do", "co", "mo", "um", "gran", "de", "a", "ni", "mal", "mas", "e", "le", "é", "mui", "to", "bo"],
    description: "Canção infantil da Xuxa que ensina sobre o elefante de forma lúdica e educativa."
  },
  {
    title: "A Casa",
    notes: ["G", "A", "B", "C1", "C1", "B", "A", "G", "F", "G", "A", "A", "G", "F", "E", "G", "A", "B", "C1", "C1", "B", "A", "G", "F", "G", "A", "A", "G", "F", "E"],
    lyrics: ["E", "ra", "u", "ma", "ca", "sa", "mui", "to", "en", "gra", "ça", "da", "não", "ti", "nha", "te", "to", "não", "ti", "nha", "na", "da", "nin", "guém", "po", "di", "a", "mo", "rar", "la"],
    description: "Canção infantil de Vinícius de Moraes que descreve uma casa incomum de forma divertida."
  },
  // Additional songs below
  {
    title: "Dona Aranha",
    notes: ["C1", "D", "E", "F", "G", "G", "F", "E", "D", "C1", "C1", "D", "E", "F", "G", "G", "F", "E", "D", "C1"],
    lyrics: ["A", "do", "na", "a", "ra", "nha", "su", "biu", "pe", "la", "pa", "re", "de", "veio", "a", "chu", "va", "for", "te", "la"],
    description: "Canção infantil brasileira sobre uma aranha que tenta subir pela parede."
  },
  {
    title: "Formiguinha",
    notes: ["G", "G", "E", "G", "C1", "G", "G", "E", "G", "C1", "E", "E", "F", "G", "A", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["A", "for", "mi", "gui", "nha", "cor", "ta", "fo", "lha", "e", "car", "re", "ga", "pro", "for", "mi", "gue
