export interface PatientData {
  identification: {
    nome: string;
    numeroEstudo: string;
    rg: string;
    cpf: string;
    endereco: string;
    email: string;
    telefoneFixo: string;
    celular: string;
    dataNascimento: string;
    sexo: string;
    estadoCivil: string;
    escolaridade: string;
    profissao: string;
    religiao: string;
    etnia: string;
    procedencia: string;
    tempoUltimoEmprego: string;
    desempregado: string;
    aposentado: string;
    tempoAposentado: string;
    contaPropria: string;
    fazOQue: string;
    tipoResidencia: string; // Casa própria ou alugada
    moraComQuem: string;
    porqueMoraComPais: string;
    pobrezaExtrema: string;
  };
  infancia: {
    prenatal: string;
    tipoParto: string;
    condicoesNascimento: string;
    posicaoProle: string;
    numeroIrmaos: string;
    desenvolvimento: string;
    doencasInfancia: string;
    cirurgiasInfancia: string;
    epilepsia: string;
    traumatismosInfancia: string;
  };
  idadeAdulta: {
    traumatismos: string;
    doencasCirurgias: string;
    tratamentos: string;
    antecedentesPsiquiatricos: string;
    fumante: string;
    alcool: string;
    atividadeFisica: string;
    sono: string;
    nutricional: string;
  };
  social: {
    relacaoFamilia: string;
    amigosInfancia: string;
    amigosAdulto: string;
    escolaInfancia: string;
    ensinoSuperior: string;
    cursos: string;
    atividadesProfissionaisAptidao: string;
    primeiroEmprego: string;
    empregoAtual: string;
    relacaoTrabalho: string;
    matrimonio: string;
    lazer: string;
    associacoes: string;
  };
  familia: {
    idadePais: string;
    paisUnidos: string;
    paisVivos: string;
    causaMortePais: string;
    idadePacienteMortePais: string;
    classeSocialPais: string;
    mudancaSocial: string;
    migracao: string;
    ocupacaoPais: string;
    escolaridadePais: string;
    doencaMentalPais: string;
    dependenciaPais: string;
    geneticaPais: string;
    violenciaDomestica: string;
    doencaMentalParentes: string;
    geneticaParentes: string;
    tracosPersonalidade: string;
    suicidioFamilia: string;
    viciosFamilia: string;
    condutaAntissocial: string;
    parentesPresos: string;
  };
}

export const INITIAL_DATA: PatientData = {
  identification: {
    nome: '', numeroEstudo: '', rg: '', cpf: '', endereco: '', email: '', telefoneFixo: '', celular: '',
    dataNascimento: '', sexo: '', estadoCivil: '', escolaridade: '', profissao: '', religiao: '', etnia: '',
    procedencia: '', tempoUltimoEmprego: '', desempregado: 'Não', aposentado: 'Não', tempoAposentado: '',
    contaPropria: 'Não', fazOQue: '', tipoResidencia: '', moraComQuem: '', porqueMoraComPais: '', pobrezaExtrema: 'Não'
  },
  infancia: {
    prenatal: '', tipoParto: '', condicoesNascimento: '', posicaoProle: '', numeroIrmaos: '',
    desenvolvimento: '', doencasInfancia: '', cirurgiasInfancia: '', epilepsia: 'Não', traumatismosInfancia: ''
  },
  idadeAdulta: {
    traumatismos: '', doencasCirurgias: '', tratamentos: '', antecedentesPsiquiatricos: '',
    fumante: 'Não', alcool: '', atividadeFisica: '', sono: '', nutricional: ''
  },
  social: {
    relacaoFamilia: '', amigosInfancia: '', amigosAdulto: '', escolaInfancia: '', ensinoSuperior: '',
    cursos: '', atividadesProfissionaisAptidao: '', primeiroEmprego: '', empregoAtual: '',
    relacaoTrabalho: '', matrimonio: '', lazer: '', associacoes: ''
  },
  familia: {
    idadePais: '', paisUnidos: '', paisVivos: '', causaMortePais: '', idadePacienteMortePais: '',
    classeSocialPais: '', mudancaSocial: '', migracao: '', ocupacaoPais: '', escolaridadePais: '',
    doencaMentalPais: '', dependenciaPais: '', geneticaPais: '', violenciaDomestica: '',
    doencaMentalParentes: '', geneticaParentes: '', tracosPersonalidade: '', suicidioFamilia: '',
    viciosFamilia: '', condutaAntissocial: '', parentesPresos: ''
  }
};