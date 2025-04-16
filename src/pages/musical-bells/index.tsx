import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Download, FileText, Volume2, VolumeX, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SongPDF } from "@/components/SongPDF";
import html2pdf from "html2pdf.js";
import { playNoteSound, stopAllAudio } from "@/utils/audioUtils";

const notes = [
  { note: "C1", label: "Dó", color: "#FF0000", colorName: "VERMELHO" },    // Red
  { note: "D", label: "Ré", color: "#FF9933", colorName: "LARANJA" },      // Orange
  { note: "E", label: "Mi", color: "#FFFF00", colorName: "AMARELO" },      // Yellow
  { note: "F", label: "Fá", color: "#33CC33", colorName: "VERDE" },        // Green
  { note: "G", label: "Sol", color: "#33CCFF", colorName: "AZUL CLARO" },  // Light Blue
  { note: "A", label: "Lá", color: "#0000FF", colorName: "AZUL" },         // Blue
  { note: "B", label: "Si", color: "#9933CC", colorName: "ROXO" },         // Purple
  { note: "C8", label: "Dó", color: "#FFFFFF", colorName: "BRANCO" },      // White
];

const songs = [
  {
    title: "Brilha, Brilha Estrelinha",
    notes: ["C1", "C1", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C1", "G", "G", "F", "F", "E", "E", "D", "G", "G", "F", "F", "E", "E", "D", "C1", "C1", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C1"],
    lyrics: ["Bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar", "lá", "no", "céu", "tão", "al", "ti", "nho", "faz", "pa", "re", "cer", "um", "dia", "man", "ti", "nho", "bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar"],
    description: "Uma canção infantil clássica, também conhecida como 'Twinkle Twinkle Little Star', com todas as estrofes completas."
  },
  {
    title: "Parabéns a Você",
    notes: ["C1", "C1", "D", "C1", "F", "E", "C1", "C1", "D", "C1", "G", "F", "C1", "C1", "C8", "A", "F", "E", "D", "C1", "D", "E", "F", "F", "E", "D", "C1"],
    lyrics: ["Pa", "ra", "béns", "a", "vo", "cê", "nes", "ta", "da", "ta", "que", "ri", "da", "mui", "tas", "fe", "li", "ci", "da", "des", "mui", "tos", "a", "nos", "de", "vi", "da"],
    description: "A tradicional canção de aniversário brasileira, com letra e melodia completas."
  },
  {
    title: "Dó-Ré-Mi",
    notes: ["C1", "D", "E", "F", "G", "A", "B", "C8", "C1", "D", "E", "F", "G", "A", "B", "C8"],
    lyrics: ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó", "es", "ca", "la", "mu", "si", "cal", "com", "ple", "ta"],
    description: "A famosa escala musical completa, ascendente e descendente."
  },
  {
    title: "Ode à Alegria",
    notes: [
      "E", "E", "F", "G", "G", "F", "E", "D", 
      "C1", "C1", "D", "E", "E", "D", "D",
      "E", "E", "F", "G", "G", "F", "E", "D", 
      "C1", "C1", "D", "E", "D", "C1", "C1",
      "D", "D", "E", "C1", "D", "E", "F", "E", "C1",
      "D", "E", "F", "E", "D", "C1", "D", "G",
      "E", "E", "F", "G", "G", "F", "E", "D",
      "C1", "C1", "D", "E", "D", "C1", "C1"
    ],
    lyrics: [
      "A", "le", "gri", "a", "be", "la", 
      "cen", "te", "lha", "di", "vi", "na", 
      "fi", "lha", "do", "E", "lí", "sio", 
      "e", "bri", "os", "pe", "ne", "tra", "mos", 
      "no", "teu", "san", "tu", "á", "rio", 
      "ce", "les", "te", "tua", "ma", "gi", "a", 
      "vol", "ta", "a", "u", "nir", "o", "que", 
      "a", "mo", "da", "se", "pa", "rou"
    ],
    description: "Tema principal do 4º movimento da Nona Sinfonia de Beethoven, 'Ode à Alegria', com notas e letra em português."
  },
  {
    title: "Escala Cromática",
    notes: ["C1", "D", "E", "F", "G", "A", "B", "C8", "B", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Su", "bin", "do", "a", "es", "ca", "la", "mú", "si", "cal", "des", "cen", "do", "a", "gora"],
    description: "Uma escala que percorre todas as notas em sequência, subindo e descendo."
  },
  {
    title: "Ciranda, Cirandinha",
    notes: ["G", "G", "G", "E", "G", "G", "G", "E", "G", "A", "G", "F", "E", "D", "A", "A", "A", "A", "B", "A", "G", "G", "E", "G", "F", "F", "E", "D", "C1"],
    lyrics: [
      "Ci", "ran", "da", "ci", "ran", "di", "nha", "vá", "mos", 
      "to", "dos", "ci", "ran", "dar", "em", "ro", "da", 
      "vol", "ta", "e", "vol", "ta", "o", "a", "nel", 
      "que", "tu", "me", "des", "te"
    ],
    description: "Canção folclórica brasileira tradicional de roda, com letra e melodia completas."
  },
  {
    title: "Marcha Soldado",
    notes: ["G", "G", "E", "C1", "C1", "E", "G", "G", "E", "D", "F", "F", "F", "E", "D", "G", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Mar", "cha", "sol", "da", "do", "ca", "be", "ça", "de", "pa", "pel", "se", "não", "mar", "char", "di", "rei\", \"ti\", \"nho\", \"vai\", \"pre\", \"so\"],
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
    description: "Canção tradicional das festas juninas no Brasil, popular entre crianças."
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
    lyrics: ["Co", "mo", "po", "de", "um", "pei", "xe", "vi", "vo", "vi", "ver", "foi", "da", "á", "gua", "cla", "ra", "co", "mo", "po", "de", "eu"],
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
    lyrics: ["A", "ga", "lin", "ha", "do", "vi", "zi", "nho", "bo", "ta", "o", "vo", "a", "ma", "re", "li", "nho", "bo", "ta", "a", "qui", "bo", "ta", "a", "co", "lá"],
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
    lyrics: ["E", "ra", "u", "ma", "ca", "sa", "mui", "to", "en", "gra", "ça", "da", "não", "ti", "nha", "te", "to", "não", "ti", "nha", "na", "da", "nin", "guém", "po", "di", "a"],
    description: "Poema musicalizado de Vinicius de Moraes que descreve uma casa muito engraçada."
  },
  {
    title: "O Pato",
    notes: ["C1", "D", "E", "G", "C1", "D", "E", "G", "E", "F", "G", "A", "G", "F", "E", "D", "C1", "D", "E", "G", "C1", "D", "E", "G"],
    lyrics: ["O", "pa", "to", "vin", "ha", "can", "tan", "do", "al", "e", "gre", "quac", "quac", "quan", "do", "um", "ho", "mem", "mau", "a", "per", "tou", "seu"],
    description: "Canção de Vinicius de Moraes que conta a história de um pato e suas aventuras."
  },
  {
    title: "Aquarela",
    notes: ["G", "A", "B", "C1", "D", "E", "F", "G", "G", "F", "E", "D", "C1", "B", "A", "G", "G", "A", "B", "C1", "D", "E", "F", "G"],
    lyrics: ["Nu", "ma", "fo", "lha", "qual", "quer", "eu", "de", "se", "nho", "um", "sol", "a", "ma", "re", "lo", "e", "com", "cin", "co", "ou", "seis", "re", "tas"],
    description: "Canção de Toquinho que compara a vida a uma pintura em aquarela."
  },
  {
    title: "A Dona Aranha",
    notes: ["C1", "D", "E", "F", "G", "G", "G", "C1", "B", "A", "G", "F", "E", "D", "C1", "C1", "D", "E", "F", "G", "G", "G", "C1", "B", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["A", "do", "na", "a", "ra", "nha", "su", "biu", "pe", "la", "pa", "re", "de", "veio", "a", "chu", "va", "for", "te", "e", "a", "der", "ru", "bou", "já", "pas", "sou", "a"],
    description: "Adaptação brasileira da canção infantil 'Itsy Bitsy Spider', sobre uma aranha e a chuva."
  },
  {
    title: "A Roda do Ônibus",
    notes: ["G", "C1", "G", "C1", "D", "E", "F", "G", "G", "C1", "G", "C1", "D", "E", "D", "C1", "G", "C1", "G", "C1", "D", "E", "F", "G"],
    lyrics: ["A", "ro", "da", "do", "ô", "ni", "bus", "ro", "da", "ro", "da", "ro", "da", "ro", "da", "a", "ro", "da", "do", "ô", "ni", "bus", "ro", "da"],
    description: "Adaptação da canção 'The Wheels on the Bus', sobre as partes de um ônibus em movimento."
  },
  {
    title: "Borboletinha",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "G", "E", "G", "E", "A", "G", "F", "E", "D", "C1", "F", "E", "D", "C1", "G", "F", "E", "D"],
    lyrics: ["Bor", "bo", "le", "ti", "nha", "tá", "na", "co", "zi", "nha", "fa", "zen", "do", "cho", "co", "la", "te", "pa", "ra", "ma", "dri", "nha", "po", "ti", "po", "ti", "po", "ti"],
    description: "Canção infantil brasileira muito popular em escolas, com todos os versos."
  },
  {
    title: "Cachorrinho está latindo",
    notes: ["C1", "C1", "D", "E", "E", "D", "C1", "C1", "D", "E", "E", "D", "C1", "C1", "D", "C1", "B", "A", "G", "C1", "C1", "D", "C1", "B", "A", "G"],
    lyrics: ["Ca", "chor", "ri", "nho", "es", "tá", "la", "tin", "do", "lá", "no", "ter", "rei", "ro", "ca", "la", "a", "bo", "ca", "ca", "chor", "ri", "nho", "va", "dio"],
    description: "Canção folclórica infantil brasileira que imita os sons de um cachorro latindo."
  },
  {
    title: "Dona Árvore",
    notes: ["G", "A", "B", "C1", "G", "A", "B", "C1", "D", "C1", "B", "A", "G", "F", "E", "D", "G", "A", "B", "C1", "G", "A", "B", "C1"],
    lyrics: ["Do", "na", "ár", "vo", "re", "do", "na", "ár", "vo", "re", "on", "de", "es", "tá", "su", "as", "fo", "lhas", "do", "na", "ár", "vo", "re", "não"],
    description: "Canção da Palavra Cantada sobre a importância das árvores e da natureza."
  },
  {
    title: "Gato Xadrez",
    notes: ["C1", "D", "E", "F", "G", "A", "G", "F", "E", "D", "C1", "C1", "D", "E", "F", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["O", "ga", "to", "xa", "drez", "faz", "miau", "miau", "faz", "miau", "miau", "o", "ga", "to", "xa", "drez", "faz", "miau", "miau", "faz", "miau", "miau"],
    description: "Música da Palavra Cantada sobre um gato com pelo xadrez e seus miados."
  },
  {
    title: "O Jacaré",
    notes: ["E", "G", "C1", "E", "G", "C1", "G", "A", "G", "F", "E", "D", "C1", "E", "G", "C1", "E", "G", "C1", "G", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Lá", "vem", "o", "ja", "ca", "ré", "Na", "bei", "ra", "do", "ri", "o", "dor", "min", "do", "na", "la", "ma", "so", "zi", "nho", "sem", "nin", "guém", "pra"],
    description: "Canção infantil da Xuxa que retrata as aventuras de um jacaré na beira do rio."
  },
  {
    title: "O Leãozinho",
    notes: ["G", "A", "B", "C1", "D", "E", "C1", "A", "G", "F", "E", "D", "C1", "G", "A", "B", "C1", "D", "E", "C1", "A", "G", "F", "E", "D", "C1"],
    lyrics: ["Go", "to", "mui", "to", "de", "te", "ver", "leão", "zi", "nho", "ca", "mi", "nhar", "sem", "ne", "nhu", "ma", "pre", "o", "cu", "pa", "ção", "pe", "la", "sa", "va"],
    description: "Canção de Toquinho que fala sobre a admiração por um pequeno leão."
  }
];

export default function MusicalBells() {
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number | null>(null);
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { toast } = useToast();
  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (playbackRef.current) {
        clearTimeout(playbackRef.current);
      }
      stopAllAudio();
    };
  }, []);

  const playNote = (note: string) => {
    const noteIndex = notes.findIndex(n => n.note === note);
    if (noteIndex >= 0) {
      setCurrentNoteIndex(noteIndex);
      
      if (audioEnabled) {
        playNoteSound(note);
      }
      
      setTimeout(() => setCurrentNoteIndex(null), 500);
    }
  };

  const playSong = (songIndex: number) => {
    if (isPlaying) {
      toast({
        title: "Uma música já está tocando",
        description: "Aguarde a música terminar antes de iniciar outra.",
        variant: "destructive",
      });
      return;
    }

    setCurrentSong(songIndex);
    setIsPlaying(true);
    
    const songNotes = songs[songIndex].notes;
    let noteIndex = 0;

    const playNextNote = () => {
      if (noteIndex < songNotes.length) {
        playNote(songNotes[noteIndex]);
        noteIndex++;
        playbackRef.current = setTimeout(playNextNote, 800);
      } else {
        if (playbackRef.current) {
          clearTimeout(playbackRef.current);
          playbackRef.current = null;
        }
        setCurrentSong(null);
        setIsPlaying(false);
        
        toast({
          title: "Música concluída",
          description: `A música "${songs[songIndex].title}" foi reproduzida com sucesso.`,
        });
      }
    };

    playNextNote();
  };

  const stopPlaying = () => {
    if (isPlaying) {
      if (playbackRef.current) {
        clearTimeout(playbackRef.current);
        playbackRef.current = null;
      }
      
      stopAllAudio();
      
      setCurrentSong(null);
      setIsPlaying(false);
      
      toast({
        title: "Música interrompida",
        description: "A reprodução da música foi interrompida.",
      });
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    toast({
      title: audioEnabled ? "Áudio desativado" : "Áudio ativado",
      description: audioEnabled 
        ? "O som das notas foi desativado." 
        : "Agora você ouvirá o som das notas musicais.",
    });
    
    if (audioEnabled) {
      stopAllAudio();
    }
  };

  const downloadSongPDF = (songIndex: number) => {
    setSelectedSong(songIndex);
    
    setTimeout(() => {
      const pdfContent = document.getElementById('song-pdf-content');
      
      if (pdfContent) {
        const options = {
          margin: [10, 10, 10, 10],
          filename: `${songs[songIndex].title}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().from(pdfContent).set(options).save();
        
        toast({
          title: "PDF gerado com sucesso",
          description: `O arquivo ${songs[songIndex].title}.pdf foi baixado.`,
        });
      }
      
      setSelectedSong(null);
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-primary text-center">
        Notas Musicais
      </h1>
      
      <div className="text-center mb-6">
        <p className="text-lg mb-4">As notas musicais são:</p>
        <p className="text-xl mb-6 font-medium">
          {notes.map(note => note.label).join(" ")}
        </p>
        <p className="text-lg mb-4">As notas serão representadas por cores:</p>
      </div>

      <div className="flex justify-end mb-4 gap-2">
        {isPlaying && (
          <Button
            variant="destructive"
            size="sm"
            onClick={stopPlaying}
            className="flex items-center gap-2"
          >
            <StopCircle className="h-4 w-4" />
            Parar Música
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAudio}
          className="flex items-center gap-2"
        >
          {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          {audioEnabled ? "Desativar Som" : "Ativar Som"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-6 w-6 text-primary" />
              Notas Musicais
            </CardTitle>
            <CardDescription>
              Clique nas notas para ouvir o som de cada sino musical
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              {notes.map(note => (
                <div key={note.note} className="flex flex-col items-center gap-2">
                  <Button
                    onClick={() => playNote(note.note)}
                    className={`transition-all h-16 w-16 rounded-full text-white font-bold hover:scale-105 ${
                      currentNoteIndex === notes.findIndex(n => n.note === note.note) ? "scale-110 ring-4 ring-white" : ""
                    }`}
                    style={{ 
                      backgroundColor: note.color,
                      boxShadow: `0 0 ${currentNoteIndex === notes.findIndex(n => n.note === note.note) ? '20px' : '10px'} rgba(0,0,0,0.3)`,
                      color: ["C8", "E"].includes(note.note) ? "#333" : "white"
                    }}
                  >
                    {note.label}
                  </Button>
                  <span className="text-sm font-medium">{note.label}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 flex-wrap border border-gray-200 rounded-lg p-4 bg-gray-50">
              {notes.map((note) => (
                <div 
                  key={note.note} 
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mx-auto"
                    style={{ 
                      backgroundColor: note.color,
                      border: note.note === "C8" ? "1px solid #ddd" : "none"
                    }}
                  ></div>
                  <span className="text-sm font-medium">{note.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-6 w-6 text-primary" />
              Músicas Simples
            </CardTitle>
            <CardDescription>
              Selecione uma música para tocar nos sinos musicais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                {songs.map((song, index) => (
                  <Card 
                    key={song.title}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${currentSong === index ? "border-primary bg-primary/10" : "border-gray-200"}`}
                  >
                    <div className="font-semibold text-lg mb-2">{song.title}</div>
                    <p className="text-sm text-gray-600 mb-3">{song.description}</p>
                    
                    <div className="mb-4 flex flex-wrap">
                      {song.notes.map((note, noteIndex) => {
                        const noteData = notes.find(n => n.note === note);
                        return (
                          <div key={`${note}-${noteIndex}`} className="inline-block text-center mr-2 mb-2">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto"
                              style={{ 
                                backgroundColor: noteData?.color,
                                color: ["C8", "E"].includes(note) ? "#333" : "white"
                              }}
                            >
                              {note}
                            </div>
                            <div className="text-xs mt-1 font-medium">
                              {song.lyrics[noteIndex] || ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadSongPDF(index);
                        }}
                      >
                        <FileText className="mr-1 h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          playSong(index);
                        }}
                        disabled={isPlaying}
                      >
                        <Music2 className="mr-1 h-4 w-4" />
                        Tocar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="hidden">
        {selectedSong !== null && (
          <div id="song-pdf-content">
            <SongPDF 
              song={songs[selectedSong]} 
              notes={notes} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
