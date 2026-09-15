import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, type OptionLetter } from '../src/generated/prisma';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DIRECT_URL or DATABASE_URL is not set');
}

const isLocal =
  connectionString.includes('127.0.0.1') ||
  connectionString.includes('localhost');

const adapter = new PrismaPg({
  connectionString,
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
});

const prisma = new PrismaClient({ adapter });

type SeedQuestion = {
  text: string;
  reference: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: OptionLetter;
};

const questions: SeedQuestion[] = [
  {
    text: '¿Quién construyó el arca según el relato del Génesis?',
    reference: 'Génesis 6:14',
    optionA: 'Abraham',
    optionB: 'Moisés',
    optionC: 'Noé',
    optionD: 'David',
    correctOption: 'C',
  },
  {
    text: '¿Cuántos días y noches llovió durante el diluvio?',
    reference: 'Génesis 7:12',
    optionA: '7',
    optionB: '40',
    optionC: '12',
    optionD: '70',
    correctOption: 'B',
  },
  {
    text: '¿A quién le prometió Dios que su descendencia sería como las estrellas?',
    reference: 'Génesis 15:5',
    optionA: 'Noé',
    optionB: 'Abraham',
    optionC: 'José',
    optionD: 'Isaac',
    correctOption: 'B',
  },
  {
    text: '¿Quién recibió los Diez Mandamientos en el monte Sinaí?',
    reference: 'Éxodo 20:1-17',
    optionA: 'Aarón',
    optionB: 'Josué',
    optionC: 'Moisés',
    optionD: 'Samuel',
    correctOption: 'C',
  },
  {
    text: '¿Cuál fue el primer mandamiento de los Diez Mandamientos?',
    reference: 'Éxodo 20:3',
    optionA: 'No matarás',
    optionB: 'No tendrás dioses ajenos delante de mí',
    optionC: 'Honra a tu padre y a tu madre',
    optionD: 'No robarás',
    correctOption: 'B',
  },
  {
    text: '¿Quién derribó los muros de Jericó?',
    reference: 'Josué 6:20',
    optionA: 'David',
    optionB: 'Sansón',
    optionC: 'Josué',
    optionD: 'Gedeón',
    correctOption: 'C',
  },
  {
    text: '¿Quién mató a Goliat?',
    reference: '1 Samuel 17:50',
    optionA: 'Saúl',
    optionB: 'Jonatán',
    optionC: 'David',
    optionD: 'Absalón',
    correctOption: 'C',
  },
  {
    text: '¿Quién fue tragado por un gran pez?',
    reference: 'Jonás 1:17',
    optionA: 'Elías',
    optionB: 'Jonás',
    optionC: 'Daniel',
    optionD: 'Job',
    correctOption: 'B',
  },
  {
    text: '¿En qué libro aparece el Salmo 23: "Jehová es mi pastor"?',
    reference: 'Salmos 23:1',
    optionA: 'Proverbios',
    optionB: 'Salmos',
    optionC: 'Eclesiastés',
    optionD: 'Isaías',
    correctOption: 'B',
  },
  {
    text: '¿Quién interpretó los sueños del faraón en Egipto?',
    reference: 'Génesis 41:25-32',
    optionA: 'Moisés',
    optionB: 'Daniel',
    optionC: 'José',
    optionD: 'Aarón',
    correctOption: 'C',
  },
  {
    text: '¿Dónde nació Jesús según el Evangelio de Mateo?',
    reference: 'Mateo 2:1',
    optionA: 'Nazaret',
    optionB: 'Jerusalén',
    optionC: 'Belén',
    optionD: 'Capernaúm',
    correctOption: 'C',
  },
  {
    text: '¿Quién bautizó a Jesús?',
    reference: 'Mateo 3:13-16',
    optionA: 'Pedro',
    optionB: 'Juan el Bautista',
    optionC: 'Andrés',
    optionD: 'Santiago',
    correctOption: 'B',
  },
  {
    text: '¿Cuántos discípulos eligió Jesús como apóstoles?',
    reference: 'Lucas 6:13',
    optionA: '7',
    optionB: '10',
    optionC: '12',
    optionD: '70',
    correctOption: 'C',
  },
  {
    text: '¿Cuál es el versículo: "Porque de tal manera amó Dios al mundo..."?',
    reference: 'Juan 3:16',
    optionA: 'Juan 1:1',
    optionB: 'Juan 3:16',
    optionC: 'Romanos 8:28',
    optionD: 'Mateo 5:14',
    correctOption: 'B',
  },
  {
    text: '¿Quién negó a Jesús tres veces?',
    reference: 'Lucas 22:61',
    optionA: 'Judas',
    optionB: 'Tomás',
    optionC: 'Pedro',
    optionD: 'Juan',
    correctOption: 'C',
  },
  {
    text: '¿Quién traicionó a Jesús por treinta monedas de plata?',
    reference: 'Mateo 26:14-15',
    optionA: 'Pedro',
    optionB: 'Judas Iscariote',
    optionC: 'Pilato',
    optionD: 'Herodes',
    correctOption: 'B',
  },
  {
    text: '¿En qué día de la semana resucitó Jesús?',
    reference: 'Marcos 16:9',
    optionA: 'Viernes',
    optionB: 'Sábado',
    optionC: 'El primer día de la semana',
    optionD: 'El tercer día de la semana',
    correctOption: 'C',
  },
  {
    text: '¿Quién escribió la mayoría de las cartas del Nuevo Testamento?',
    reference: 'Romanos 1:1',
    optionA: 'Pedro',
    optionB: 'Juan',
    optionC: 'Pablo',
    optionD: 'Santiago',
    correctOption: 'C',
  },
  {
    text: '¿Cuál es el último libro de la Biblia?',
    reference: 'Apocalipsis 1:1',
    optionA: 'Judas',
    optionB: 'Hebreos',
    optionC: 'Apocalipsis',
    optionD: 'Hechos',
    correctOption: 'C',
  },
  {
    text: '¿Cuál es el fruto del Espíritu mencionado primero en Gálatas?',
    reference: 'Gálatas 5:22',
    optionA: 'Paz',
    optionB: 'Gozo',
    optionC: 'Amor',
    optionD: 'Paciencia',
    correctOption: 'C',
  },
];

async function main() {
  const result = await prisma.question.createMany({
    data: questions,
    skipDuplicates: true,
  });

  const total = await prisma.question.count();
  console.log(`Seed OK: inserted ${result.count}, total questions: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
