import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music2, Download, FileText, Volume2, VolumeX, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SongPDF } from "@/components/SongPDF";
import html2pdf from "html2pdf.js";
import { playNoteSound, stopAllAudio } from "@/utils/audioUtils";

const notes = [
  { note: "C↓", label: "Dó↓", color: "#FF0000", colorName: "VERMELHO" },    // Red - Low Dó
  { note: "D", label: "Ré", color: "#FF9933", colorName: "LARANJA" },      // Orange
  { note: "E", label: "Mi", color: "#FFFF00", colorName: "AMARELO" },      // Yellow
  { note: "F", label: "Fá", color: "#33CC33", colorName: "VERDE" },        // Green
  { note: "G", label: "Sol", color: "#33CCFF", colorName: "AZUL CLARO" },  // Light Blue
  { note: "A", label: "Lá", color: "#0000FF", colorName: "AZUL" },         // Blue
  { note: "B", label: "Si", color: "#9933CC", colorName: "ROXO" },         // Purple
  { note: "C↑", label: "Dó↑", color: "#FFFFFF", colorName: "BRANCO" },      // White - High Dó
];

const songs = [
  {
    title: "Brilha, Brilha Estrelinha",
    notes: ["C↓", "C↓", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C↓", "G", "G", "F", "F", "E", "E", "D", "G", "G", "F", "F", "E", "E", "D", "C↓", "C↓", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D", "D", "C↓"],
    lyrics: ["Bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar", "lá", "no", "céu", "tão", "al", "ti", "nho", "faz", "pa", "re", "cer", "um", "dia", "man", "ti", "nho", "bri", "lha", "bri", "lha", "es", "tre", "li", "nha", "quero", "ver", "você", "bri", "lhar"],
    description: "Uma canção infantil clássica, também conhecida como 'Twinkle Twinkle Little Star', com todas as estrofes completas."
  },
  {
    title: "Parabéns a Você",
    notes: ["C↓", "C↓", "D", "C↓", "F", "E", "C↓", "C↓", "D", "C↓", "G", "F", "C↓", "C↓", "C↑", "A", "F", "E", "D", "C↓", "D", "E", "F", "F", "E", "D", "C↓"],
    lyrics: ["Pa", "ra", "béns", "a", "vo", "cê", "nes", "ta", "da", "ta", "que", "ri", "da", "mui", "tas", "fe", "li", "ci", "da", "des", "mui", "tos", "a", "nos", "de", "vi", "da"],
    description: "A tradicional canção de aniversário brasileira, com letra e melodia completas."
  },
  {
    title: "Dó-Ré-Mi",
    notes: ["C↓", "D", "E", "F", "G", "A", "B", "C↑", "C↓", "D", "E", "F", "G", "A", "B", "C↑"],
    lyrics: ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó", "es", "ca", "la", "mu", "si", "cal", "com", "ple", "ta"],
    description: "A famosa escala musical completa, ascendente e descendente."
  },
  {
    title: "Ode à Alegria",
    notes: [
      "E", "E", "F", "G", "G", "F", "E", "D", 
      "C↓", "C↓", "D", "E", "E", "D", "D",
      "E", "E", "F", "G", "G", "F", "E", "D", 
      "C↓", "C↓", "D", "E", "D", "C↓", "C↓",
      "D", "D", "E", "C↓", "D", "E", "F", "E", "C↓",
      "D", "E", "F", "E", "D", "C↓", "D", "G",
      "E", "E", "F", "G", "G", "F", "E", "D",
      "C↓", "C↓", "D", "E", "D", "C↓", "C↓"
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
    notes: ["C↓", "D", "E", "F", "G", "A", "B", "C↑", "B", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["Su", "bin", "do", "a", "es", "ca", "la", "mú", "si", "cal", "des", "cen", "do", "a", "gora"],
    description: "Uma escala que percorre todas as notas em sequência, subindo e descendo."
  },
  {
    title: "Ciranda, Cirandinha",
    notes: ["G", "G", "G", "E", "G", "G", "G", "E", "G", "A", "G", "F", "E", "D", "A", "A", "A", "A", "B", "A", "G", "G", "E", "G", "F", "F", "E", "D", "C↓"],
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
    notes: ["G", "G", "E", "C↓", "C↓", "E", "G", "G", "E", "D", "F", "F", "F", "E", "D", "G", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["Mar", "cha", "sol", "da", "do", "ca", "be", "ça", "de", "pa", "pel", "se", "não", "mar", "char", "di", "rei", "ti", "nho", "vai", "pre", "so", "já"],
    description: "Canção infantil brasileira tradicional com todos os versos."
  },
  {
    title: "O Sapo Não Lava o Pé",
    notes: ["G", "C↓", "C↓", "G", "A", "G", "E", "G", "C↓", "C↓", "G", "A", "G", "F", "G", "B", "B", "G", "A", "G", "B", "B", "G", "A", "G", "B", "G", "A", "B", "C↓"],
    lyrics: ["O", "sa", "po", "não", "la", "va", "o", "pé", "não", "la", "va", "por", "que", "não", "e", "le", "mo", "ra", "lá", "na", "la", "go", "a", "não", "la", "va", "o", "pé"],
    description: "Canção infantil brasileira divertida e educativa, com todos os versos."
  },
  {
    title: "Frère Jacques",
    notes: ["C↓", "D", "E", "C↓", "C↓", "D", "E", "C↓", "E", "F", "G", "E", "F", "G", "G", "A", "G", "F", "E", "C↓", "G", "G", "A", "G", "F", "E", "C↓"],
    lyrics: ["Frè", "re", "Jac", "ques", "Frè", "re", "Jac", "ques", "Dor", "mez", "vous", "Dor", "mez", "vous", "Son", "nez", "les", "ma", "ti", "nes", "Son", "nez", "les", "ma", "ti", "nes", "Din", "din", "don"],
    description: "Canção de origem francesa conhecida em todo o mundo, com todos os versos."
  },
  {
    title: "Escravos de Jó",
    notes: ["C↓", "B", "A", "G", "A", "G", "A", "G", "F", "E", "G", "E", "G", "E", "E", "E", "D", "C↓", "G", "A", "G", "E", "G", "A", "G", "E", "G", "A", "G", "A", "B", "C↓", "G", "A", "G", "E", "G", "A", "G", "E", "G", "A", "G", "A", "B", "C↓"],
    lyrics: [
      "Es", "cra", "vos", "de", "Jó", 
      "Jo", "ga", "vam", "ca", "xan", "gá", 
      "Ti", "ra", "põe", 
      "Dei", "xa", "o", "Zé", "Pei", "rei", "ra", "fi", "car", 
      "Guer", "rei", "ros", "com", "guer", "rei", "ros", 
      "Fa", "zem", "zi", "gue", "zi", "gue", "zá", 
      "Guer", "rei", "ros", "com", "guer", "rei", "ros", 
      "Fa", "zem", "zi", "gue", "zi", "gue", "zá"
    ],
    description: "Música folclórica brasileira usada em jogos infantis, com todos os versos."
  },
  {
    title: "Cai, Cai, Balão",
    notes: ["G", "G", "E", "E", "G", "G", "E", "E", "G", "A", "G", "F", "E", "D", "D", "E", "F", "D", "E", "F", "D", "E", "F", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["Cai", "cai", "ba", "lão", "cai", "cai", "ba", "lão", "a", "qui", "na", "mi", "nha", "mão", "não", "cai", "não", "não", "não", "não", "cai", "a", "qui", "na", "mi", "nha", "mão", "mão", "mão", "mão", "mão"],
    description: "Canção tradicional das festas juninas no Brasil, com todos os versos."
  },
  {
    title: "A Canoa Virou",
    notes: ["G", "G", "G", "G", "E", "E", "E", "G", "C↓", "C↓", "B", "A", "A", "C↓", "D", "D", "C↓", "B", "B", "A", "G", "G", "G", "F", "E", 
            "G", "G", "G", "G", "E", "E", "E", "G", "C↓", "C↓", "B", "A", "A", "C↓", "D", "D", "C↓", "B", "B", "A", "G", "G", "G", "A", "B", "C↓"],
    lyrics: [
      "A", "ca", "no", "a", "vi", "rou", "por", "dei", "xar", "e", "la", "vi", "rar", "foi", "por", "cau", "sa", "do", 
      "Ma", "ri", "a", "que", "não", "sou", "be", "re", "mar",
      "A", "ca", "no", "a", "vi", "rou", "por", "dei", "xar", "e", "la", "vi", "rar", "foi", "por", "cau", "sa", "do", 
      "Ma", "ri", "a", "que", "não", "sou", "be", "re", "mar"
    ],
    description: "Canção folclórica brasileira completa com todos os versos."
  },
  {
    title: "Eu Vi Uma Barata",
    notes: [
      "C↓", "F", "E", "D", "C↓", "D", "C↓", "D", "C↓", "D", "C↓", "D", "E", "F",
      "C↓", "F", "E", "D", "C↓", "D", "C↓", "D", "C↓", "D", "C↓", "D", "E", "F",
      "C↓", "D", "E", "F", "F", "F", "C↓", "D", "C↓", "D", "D", "D", "C↓", "G", "F", "E", "E", "E", "C↓", "D", "E", "F", "F", "F"
    ],
    lyrics: [
      "Eu", "vi", "u", "ma", "ba", "ra", "ta", "na", "ca", "re", "ca", "do", "ve", "lho",
      "Eu", "vi", "u", "ma", "ba", "ra", "ta", "na", "ca", "re", "ca", "do", "ve", "lho",
      "pa", "dre", "an", "tô", "nio", "sai", "ba", "ra", "ta", "dei", "a", "qui", "la", "ba", "ra", "ta", "dei", "a", "qui", "la", "ba", "ra", "ta", "dei"
    ],
    description: "Canção infantil brasileira simples e divertida, com todos os versos."
  },
  {
    title: "Se Esta Rua Fosse Minha",
    notes: [
      "E", "E", "A", "A", "E", "C↓", "A", "C↓", "G", "F", "E", "D", 
      "E", "E", "B", "B", "F", "E", "F", "E", "C↓", "B", "A", 
      "E", "E", "A", "A", "C↓", "B", "A", "G", "F", "E", "G", "F",
      "F", "F", "E", "B", "F", "E", "D", "C↓", "B", "A"
    ],
    lyrics: [
      "Se", "es", "ta", "ru", "a", "fos", "se", "mi", "nha", "eu", "man", "da", 
      "la", "dri", "lhar", "com", "pe", "dri", "nhas", "de", "bri", "lhan", "te", 
      "pa", "ra", "o", "meu", "a", "mor", "pas", "sar", 
      "de", "ou", "tro", "mo", "do", "pa", "ra", "eu", "po", "der", "pas", "sar"
    ],
    description: "Canção de ninar tradicional brasileira completa."
  },
  {
    title: "Borboletinha",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C↓", "G", "E", "G", "E", "A", "G", "F", "E", "D", "C↓", "F", "E", "D", "C↓", "G", "F", "E", "D"],
    lyrics: ["Bor", "bo", "le", "ti", "nha", "tá", "na", "co", "zi", "nha", "fa", "zen", "do", "cho", "co", "la", "te", "pa", "ra", "ma", "dri", "nha", "po", "ti", "po", "ti", "po", "ti"],
    description: "Canção infantil brasileira muito popular em escolas, com todos os versos."
  },
  {
    title: "Jingle Bells",
    notes: ["E", "E", "E", "E", "E", "E", "E", "G", "C↓", "D", "E", "F", "F", "F", "F", "F", "E", "E", "E", "E", "D", "D", "E", "D", "G"],
    lyrics: ["Jin", "gle", "bells", "jin", "gle", "bells", "jin", "gle", "all", "the", "way", "oh", "what", "fun", "it", "is", "to", "ride", "in", "a", "one", "horse", "o", "pen", "sleigh"],
    description: "Música natalina conhecida mundialmente, com todos os versos do refrão."
  },
  {
    title: "Atirei o Pau no Gato",
    notes: ["G", "E", "E", "F", "G", "G", "G", "A", "G", "F", "E", "D", "C↓", "G", "E", "E", "F", "G", "G", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["A", "ti", "rei", "o", "pau", "no", "ga", "to", "to", "mas", "o", "ga", "to", "não", "mor", "reu", "reu", "reu", "do", "na", "chi", "ca", "ca", "ad", "mi", "rou"],
    description: "Canção infantil tradicional brasileira, com todos os versos."
  },
  {
    title: "Caranguejo",
    notes: ["C↓", "C↓", "A", "A", "G", "G", "E", "G", "A", "G", "F", "E", "C↓", "C↓", "A", "A", "G", "G", "E", "G", "A", "G", "F", "E"],
    lyrics: ["Ca", "ran", "gue", "jo", "não", "é", "pei", "xe", "ca", "ran", "gue", "jo", "pei", "xe", "é", "na", "va", "zi", "nha", "ni", "ma", "ré"],
    description: "Música folclórica brasileira popular em brincadeiras infantis, com todos os versos."
  },
  {
    title: "Row, Row, Row Your Boat",
    notes: ["C↓", "C↓", "C↓", "D", "E", "E", "D", "E", "F", "G", "C↑", "C↑", "C↑", "G", "G", "G", "E", "E", "E", "C↓", "C↓", "C↓"],
    lyrics: ["Row", "row", "row", "your", "boat", "gen", "tly", "down", "the", "stream", "mer", "ri", "ly", "mer", "ri", "ly", "mer", "ri", "ly", "mer", "ri", "ly"],
    description: "Canção infantil inglesa tradicional, com todos os versos."
  },
  {
    title: "Samba Lelê",
    notes: ["G", "G", "G", "E", "A", "A", "G", "E", "G", "F", "E", "D", "C↓", "G", "G", "G", "E", "A", "A", "G", "E", "G", "F", "E", "D", "C↓"],
    lyrics: ["Sam", "ba", "Le", "lê", "es", "tá", "do", "en", "te", "es", "tá", "com", "a", "ca", "be", "ça", "que", "bra", "da", "pre", "ci", "sa", "de", "u", "ma", "ben", "ção"],
    description: "Canção folclórica brasileira muito usada em brincadeiras, com todos os versos."
  },
  {
    title: "London Bridge",
    notes: ["G", "A", "G", "F", "E", "F", "G", "D", "E", "F", "E", "F", "G", "G", "A", "G", "F", "E", "F", "G", "D", "G", "E", "C↓"],
    lyrics: ["Lon", "don", "Bridge", "is", "fal", "ling", "down", "fal", "ling", "down", "fal", "ling", "down", "Lon", "don", "Bridge", "is", "fal", "ling", "down", "my", "fair", "la", "dy"],
    description: "Canção tradicional inglesa conhecida mundialmente, com todos os versos."
  },
  {
    title: "Meu Lanchinho",
    notes: ["C↓", "D", "E", "C↓", "C↓", "D", "E", "C↓", "E", "F", "G", "E", "F", "G", "C↓", "D", "E", "C↓", "C↓", "D", "E", "C↓"],
    lyrics: ["Meu", "lan", "chi", "nho", "meu", "lan", "chi", "nho", "vou", "co", "mer", "pra", "fi", "car", "for", "ti", "nho", "e", "cres", "cer"],
    description: "Canção infantil brasileira cantada na hora do lanche escolar, com todos os versos."
  },
  {
    title: "Pirulito que Bate Bate",
    notes: ["G", "E", "G", "E", "A", "G", "F", "E", "D", "C↓", "D", "E", "F", "G", "E", "G", "E", "A", "G", "F", "E", "D", "C↓", "D", "E", "F"],
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
    notes: ["G", "G", "E", "G", "A", "A", "G", "F", "E", "D", "C↓", "G", "G", "E", "G", "A", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["Pas", "sa", "ri", "nho", "que", "som", "é", "es", "se", "que", "tu", "fa", "zes", "quan", "do", "vo", "as", "pe", "lo", "ar", "piu", "piu"],
    description: "Canção educativa brasileira para ensinar sons de animais, com todos os versos."
  },
  {
    title: "Sapo Cururu",
    notes: ["C↓", "D", "E", "G", "C↓", "D", "E", "G", "E", "F", "G", "A", "G", "F", "E", "D", "C↓", "D", "E", "G", "C↓", "D", "E", "G"],
    lyrics: ["Sa", "po", "cu", "ru", "ru", "na", "bei", "ra", "do", "ri", "o", "quan", "do", "o", "sa", "po", "can", "ta", "ó", "ma", "na", "é", "por", "que"],
    description: "Canção tradicional das festas juninas no Brasil, popular entre crianças."
  },
  {
    title: "O Sítio do Seu Lobato",
    notes: ["G", "G", "G", "D", "E", "E", "D", "B", "B", "A", "B", "C↓", "G", "G", "G", "D", "E", "E", "D", "B", "B", "A", "B", "C↓"],
    lyrics: ["Seu", "Lo", "ba", "to", "ti", "nha", "um", "sí", "tio", "ia", "ia", "ô", "e", "nes", "se", "sí", "tio", "ti", "nha", "um", "ca", "chor", "ro", "au"],
    description: "Canção infantil educativa que apresenta os sons dos animais da fazenda."
  },
  {
    title: "A Barata Diz Que Tem",
    notes: ["E", "E", "F", "G", "G", "F", "E", "D", "E", "E", "F", "G", "G", "F", "E", "D", "D", "D", "E", "F", "E", "D", "C↓", "D", "E", "C↓"],
    lyrics: ["A", "ba", "ra", "ta", "diz", "que", "tem", "se", "te", "sai", "as", "de", "fi", "ló", "é", "men", "ti", "ra", "da", "ba", "ra", "ta", "e", "la", "tem", "é"],
    description: "Canção folclórica divertida que retrata as mentiras de uma barata sobre suas posses."
  },
  {
    title: "Boi da Cara Preta",
    notes: ["G", "G", "E", "C↓", "G", "G", "E", "C↓", "C↓", "C↓", "D", "E", "D", "C↓", "B", "A", "G"],
    lyrics: ["Boi", "boi", "boi", "boi", "da", "ca", "ra", "pre", "ta", "pe", "ga", "es", "sa", "cri", "an", "ça", "que"],
    description: "Cantiga de ninar tradicional brasileira, usada para acalmar crianças pequenas."
  },
  {
    title: "Peixe Vivo",
    notes: ["C↓", "E", "G", "C↓", "E", "G", "A", "G", "F", "E", "D", "C↓", "C↓", "E", "G", "C↓", "E", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["Co", "mo", "po", "de", "um", "pei", "xe", "vi", "vo", "vi", "ver", "foi", "da", "á", "gua", "cla", "ra", "co", "mo", "po", "de", "eu"],
    description: "Canção folclórica brasileira que expressa sentimentos de saudade e pertencimento."
  },
  {
    title: "Indiozinhos",
    notes: ["E", "G", "C↓", "E", "G", "C↓", "E", "D", "C↓", "B", "A", "G", "E", "G", "C↓", "E", "G", "C↓", "E", "D", "C↓", "B", "A", "G"],
    lyrics: ["Um", "dois", "três", "ín", "dios", "zi", "nhos", "qua", "tro", "cin", "co", "seis", "ín", "dios", "zi", "nhos", "se", "te", "oi", "to", "no", "ve", "ín", "dios"],
    description: "Cantiga infantil que ensina os números de forma divertida, contando índios."
  },
  {
    title: "A Linda Rosa Juvenil",
    notes: ["C↓", "D", "E", "F", "G", "G", "A", "G", "F", "E", "D", "C↓", "C↓", "D", "E", "F", "G", "G", "A", "G", "F", "E", "D", "C↓"],
    lyrics: ["A", "lin", "da", "ro", "sa", "ju", "ve", "nil", "ju", "ve", "nil", "ju", "ve", "nil", "a", "lin", "da", "ro", "sa", "ju", "ve", "nil", "ju", "ve", "nil"],
    description: "Cantiga infantil tradicional que conta a história de uma linda rosa que adormeceu."
  },
  {
    title: "Capelinha de Melão",
    notes: ["G", "A", "B", "G", "A", "B", "C↓", "B", "A", "G", "F", "E", "G", "A", "B", "G", "A", "B", "C↓", "B", "A", "G", "F", "E"],
    lyrics: ["Ca", "pe", "li", "nha", "de", "me", "lão", "é", "de", "São", "Jo", "ão", "é", "de", "cra", "vo", "é", "de", "ro", "sa", "é", "de", "man", "je"],
    description: "Canção junina tradicional, cantada durante as festas de São João no Brasil."
  },
  {
    title: "Nesta Rua",
    notes: ["C↓", "E", "G", "C↓", "B", "A", "G", "E", "G", "F", "E", "D", "C↓", "C↓", "E", "G", "C↓", "B", "A", "G", "E", "G", "F", "E", "D", "C↓"],
    lyrics: ["Nes", "ta", "ru", "a", "nes", "ta", "ru", "a", "tem", "um", "bos", "que", "que", "se", "cha", "ma", "se", "cha", "ma", "so", "li", "dão", "den", "tro", "de", "le"],
    description: "Canção folclórica brasileira tradicional que fala sobre amor e saudade."
  }
];

const MusicalBells = () => {
  const [selectedSong, setSelectedSong] = useState<typeof songs[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(-1);
  const pdfRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const playingTimerRef = useRef<number | null>(null);

  const playNote = (note: string, index: number) => {
    if (muted) return;
    
    setCurrentNoteIndex(index);
    playNoteSound(note);
    
    // Highlight timing
    setTimeout(() => {
      if (currentNoteIndex === index) {
        setCurrentNoteIndex(-1);
      }
    }, 500);
  };

  const playSong = () => {
    if (!selectedSong) return;
    
    setIsPlaying(true);
    let noteIndex = 0;
    
    const playNextNote = () => {
      if (noteIndex < selectedSong.notes.length) {
        playNote(selectedSong.notes[noteIndex], noteIndex);
        noteIndex++;
        playingTimerRef.current = window.setTimeout(playNextNote, 800);
      } else {
        setIsPlaying(false);
        setCurrentNoteIndex(-1);
      }
    };
    
    playNextNote();
  };

  const stopPlaying = () => {
    if (playingTimerRef.current) {
      clearTimeout(playingTimerRef.current);
      playingTimerRef.current = null;
    }
    stopAllAudio();
    setIsPlaying(false);
    setCurrentNoteIndex(-1);
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (!muted) {
      stopAllAudio();
    }
  };

  const handleSongSelect = (song: typeof songs[0]) => {
    stopPlaying();
    setSelectedSong(song);
  };

  const generatePDF = () => {
    if (!selectedSong || !pdfRef.current) return;
    
    const element = pdfRef.current;
    const options = {
      margin: 10,
      filename: `${selectedSong.title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(options).from(element).save();
    
    toast({
      title: "PDF gerado com sucesso!",
      description: `O arquivo "${selectedSong.title}.pdf" está pronto para download.`,
    });
  };

  useEffect(() => {
    return () => {
      if (playingTimerRef.current) {
        clearTimeout(playingTimerRef.current);
      }
      stopAllAudio();
    };
  }, []);

  const findNoteColor = (noteValue: string) => {
    const noteObj = notes.find(n => n.note === noteValue);
    return noteObj ? noteObj.color : "#FFFFFF";
  };

  const findNoteLabel = (noteValue: string) => {
    const noteObj = notes.find(n => n.note === noteValue);
    return noteObj ? noteObj.label : noteValue;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Sinos Musicais</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Músicas</CardTitle>
              <CardDescription>Selecione uma música para tocar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[60vh] overflow-y-auto space-y-2 pr-2">
                {songs.map((song, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      selectedSong?.title === song.title
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                    onClick={() => handleSongSelect(song)}
                  >
                    <div className="font-medium">{song.title}</div>
                    <div className="text-xs opacity-80">{song.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          {selectedSong ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSong.title}</CardTitle>
                  <CardDescription>{selectedSong.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {selectedSong.notes.map((note, idx) => (
                      <div
                        key={idx}
                        className={`relative p-4 w-12 h-12 flex items-center justify-center rounded-full transition-transform ${
                          currentNoteIndex === idx ? "scale-110 ring-4 ring-primary" : ""
                        }`}
                        style={{ backgroundColor: findNoteColor(note) }}
                        onClick={() => playNote(note, idx)}
                      >
                        <span 
                          className={`font-bold ${
                            ["#FFFF00", "#33CCFF", "#FFFFFF"].includes(findNoteColor(note))
                              ? "text-black"
                              : "text-white"
                          }`}
                        >
                          {findNoteLabel(note)}
                        </span>
                        {selectedSong.lyrics && selectedSong.lyrics[idx] && (
                          <span 
                            className={`absolute -bottom-5 text-xs ${
                              currentNoteIndex === idx ? "font-bold" : ""
                            }`}
                          >
                            {selectedSong.lyrics[idx]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3 mt-10">
                    {isPlaying ? (
                      <Button
                        variant="destructive"
                        onClick={stopPlaying}
                        className="flex items-center gap-2"
                      >
                        <StopCircle size={16} />
                        Parar
                      </Button>
                    ) : (
                      <Button 
                        onClick={playSong} 
                        className="flex items-center gap-2"
                      >
                        <Music2 size={16} />
                        Tocar Música
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={toggleMute}
                      className="flex items-center gap-2"
                    >
                      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      {muted ? "Ativar Som" : "Silenciar"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={generatePDF}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} />
                      Baixar PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="hidden">
                <div ref={pdfRef}>
                  <SongPDF
                    title={selectedSong.title}
                    notes={selectedSong.notes}
                    lyrics={selectedSong.lyrics}
                    description={selectedSong.description}
                    findNoteColor={findNoteColor}
                    findNoteLabel={findNoteLabel}
                  />
                </div>
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Instruções</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <FileText size={48} className="text-muted-foreground" />
                  <p>Selecione uma música da lista para começar</p>
                  <p className="text-sm text-muted-foreground">
                    Você poderá tocar os sinos individualmente ou reproduzir a música completa
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Cores dos Sinos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {notes.map((note) => (
                  <div
                    key={note.note}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: note.color }}
                    ></div>
                    <div>
                      <div className="text-sm font-medium">{note.label}</div>
                      <div className="text-xs text-muted-foreground">{note.colorName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MusicalBells;
