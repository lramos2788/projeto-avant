import React, { useState, useEffect } from 'react';
import { PatientData, INITIAL_DATA } from './types';
import { FormSection, Input, Select, TextArea } from './FormComponents';
import { encodeData, decodeData, downloadJSON } from './utils';
import { 
  ClipboardDocumentCheckIcon, 
  LinkIcon, 
  UserIcon, 
  HomeIcon, 
  UsersIcon, 
  ClockIcon, 
  HeartIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

enum Section {
  IDENTIFICATION = 'Identificação',
  CHILDHOOD = 'Infância & Adolescência',
  ADULTHOOD = 'Idade Adulta',
  SOCIAL = 'Interação Social',
  FAMILY = 'Antecedentes Familiares',
  FINISH = 'Finalizar'
}

const TABS = [
  { id: Section.IDENTIFICATION, icon: UserIcon },
  { id: Section.CHILDHOOD, icon: ClockIcon },
  { id: Section.ADULTHOOD, icon: HeartIcon },
  { id: Section.SOCIAL, icon: UsersIcon },
  { id: Section.FAMILY, icon: HomeIcon },
];

export default function App() {
  const [data, setData] = useState<PatientData>(INITIAL_DATA);
  const [activeSection, setActiveSection] = useState<Section>(Section.IDENTIFICATION);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [isBlobUrl, setIsBlobUrl] = useState(false);
  const [patientFinished, setPatientFinished] = useState(false);

  useEffect(() => {
    // Check for existing data in hash
    const hashData = decodeData(window.location.hash);
    if (hashData) {
      setData(hashData);
      setIsReviewMode(true);
    }

    // Check if running on a blob URL (preview environment)
    if (window.location.protocol === 'blob:') {
      setIsBlobUrl(true);
    }
  }, []);

  const handleChange = (section: keyof PatientData, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Reset finish state if user edits something after finishing
    if (patientFinished) setPatientFinished(false);
  };

  const generateResponseLink = () => {
    const encoded = encodeData(data);
    const baseUrl = window.location.href.split('#')[0];
    return `${baseUrl}#${encoded}`;
  };

  const handlePatientFinish = () => {
    const link = generateResponseLink();
    setGeneratedLink(link);
    setPatientFinished(true);
    // Scroll to top of success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = () => {
    const fileName = `AVANT_Paciente_${data.identification.nome || 'SemNome'}_${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(data, fileName);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 3000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  // Helper for cleaner JSX
  const update = (section: keyof PatientData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    handleChange(section, e.target.name, e.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="bg-primary-600 text-white p-1 rounded-md text-sm">AVANT</span>
                Projeto Avant
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Coleta de dados históricos e demográficos para Transtorno de Ansiedade Generalizada
              </p>
            </div>
            {isReviewMode && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-medium self-start flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                Modo de Visualização/Revisão
              </div>
            )}
          </div>
          {isBlobUrl && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-3">
               <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
               <div className="text-sm text-red-700">
                 <strong>Atenção (Ambiente de Teste):</strong> Este formulário está rodando em um endereço temporário ("blob:"). 
                 Os links gerados aqui <u>não funcionarão</u> se enviados para outra pessoa. Para coletar dados agora, 
                 use a opção <strong>"Baixar Arquivo de Respostas"</strong> na etapa final e envie o arquivo.
               </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isCurrent 
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                }`}
              >
                <Icon className={`h-5 w-5 ${isCurrent ? 'text-primary-600' : 'text-slate-400'}`} />
                {tab.id}
              </button>
            );
          })}
          <button
            onClick={() => setActiveSection(Section.FINISH)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === Section.FINISH
                ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
                : 'text-slate-600 hover:bg-slate-100 border-l-4 border-transparent'
            }`}
          >
            <ClipboardDocumentCheckIcon className={`h-5 w-5 ${activeSection === Section.FINISH ? 'text-green-600' : 'text-slate-400'}`} />
            Finalizar & Enviar
          </button>
        </nav>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-6 md:p-8">
          
          <FormSection title="3. Identificação do Paciente" isActive={activeSection === Section.IDENTIFICATION}>
            <Input label="Nome completo" name="nome" value={data.identification.nome} onChange={update('identification')} fullWidth />
            <Input label="Número do paciente no estudo" name="numeroEstudo" value={data.identification.numeroEstudo} onChange={update('identification')} />
            <Input label="RG" subLabel="Incluir órgão emissor e UF" name="rg" value={data.identification.rg} onChange={update('identification')} />
            <Input label="CPF" name="cpf" value={data.identification.cpf} onChange={update('identification')} />
            <Input label="Data de Nascimento" placeholder="Dia/Mês/Ano" name="dataNascimento" value={data.identification.dataNascimento} onChange={update('identification')} />
            <Input label="Endereço completo" fullWidth subLabel="Rua, número, apto, bairro, cidade, Estado, CEP" name="endereco" value={data.identification.endereco} onChange={update('identification')} />
            <Input label="E-mail" type="email" name="email" value={data.identification.email} onChange={update('identification')} />
            <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
               <Input label="Telefone Fixo (com DDD)" name="telefoneFixo" value={data.identification.telefoneFixo} onChange={update('identification')} />
               <Input label="Celular (com DDD)" name="celular" value={data.identification.celular} onChange={update('identification')} />
            </div>
            
            <Select label="Sexo" options={['Masculino', 'Feminino', 'Outro']} name="sexo" value={data.identification.sexo} onChange={update('identification')} />
            <Select label="Estado Civil" options={['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']} name="estadoCivil" value={data.identification.estadoCivil} onChange={update('identification')} />
            <Input label="Escolaridade" name="escolaridade" value={data.identification.escolaridade} onChange={update('identification')} />
            <Input label="Profissão Atual" name="profissao" value={data.identification.profissao} onChange={update('identification')} />
            <Input label="Religião" name="religiao" value={data.identification.religiao} onChange={update('identification')} />
            <Select label="Grupo Étnico" options={['Branco', 'Negro', 'Indígena', 'Mestiço', 'Outro']} name="etnia" value={data.identification.etnia} onChange={update('identification')} />
            <Input label="Procedência" subLabel="Região do país ou nação estrangeira" name="procedencia" value={data.identification.procedencia} onChange={update('identification')} />
            <Input label="Tempo no último emprego" name="tempoUltimoEmprego" value={data.identification.tempoUltimoEmprego} onChange={update('identification')} />
            
            <Select label="Está desempregado(a)?" options={['Sim', 'Não']} name="desempregado" value={data.identification.desempregado} onChange={update('identification')} />
            <div className="grid grid-cols-2 gap-4 col-span-1">
                <Select label="Aposentado(a)?" options={['Sim', 'Não']} name="aposentado" value={data.identification.aposentado} onChange={update('identification')} />
                <Input label="Há quanto tempo?" name="tempoAposentado" value={data.identification.tempoAposentado} onChange={update('identification')} disabled={data.identification.aposentado !== 'Sim'} />
            </div>
            
            <Select label="Trabalha por conta própria?" options={['Sim', 'Não']} name="contaPropria" value={data.identification.contaPropria} onChange={update('identification')} />
            <Input label="Fazendo o que?" name="fazOQue" value={data.identification.fazOQue} onChange={update('identification')} disabled={data.identification.contaPropria !== 'Sim'} />
            
            <Select label="Tipo de Residência" options={['Própria', 'Alugada', 'Outra']} name="tipoResidencia" value={data.identification.tipoResidencia} onChange={update('identification')} />
            <Input label="Reside com os pais ou parentes?" placeholder="Se sim, quais?" name="moraComQuem" value={data.identification.moraComQuem} onChange={update('identification')} />
            <TextArea label="Se reside com pais/parentes, por que?" name="porqueMoraComPais" value={data.identification.porqueMoraComPais} onChange={update('identification')} />
            <Select label="Vive ou viveu em pobreza extrema?" options={['Sim', 'Não']} name="pobrezaExtrema" value={data.identification.pobrezaExtrema} onChange={update('identification')} />
          </FormSection>

          <FormSection title="4.4.1 Infância e Adolescência" isActive={activeSection === Section.CHILDHOOD}>
            <TextArea label="Pré-natal" subLabel="Gestação, intoxicações, enfermidades maternas, etc." name="prenatal" value={data.infancia.prenatal} onChange={update('infancia')} />
            <Input label="Tipo de parto" placeholder="Normal, Cesariana, etc." name="tipoParto" value={data.infancia.tipoParto} onChange={update('infancia')} />
            <TextArea label="Condições do nascimento" subLabel="Peso, anóxia, icterícia, etc." name="condicoesNascimento" value={data.infancia.condicoesNascimento} onChange={update('infancia')} />
            <Input label="Posição na prole" placeholder="Ex: 1º de 3 irmãos" name="posicaoProle" value={data.infancia.posicaoProle} onChange={update('infancia')} />
            <Input label="Número de irmãos/irmãs" subLabel="Incluir meio-irmãos" name="numeroIrmaos" value={data.infancia.numeroIrmaos} onChange={update('infancia')} />
            <TextArea label="Desenvolvimento psicomotor" subLabel="Idade que andou, falou, escola, distúrbios, etc." name="desenvolvimento" value={data.infancia.desenvolvimento} onChange={update('infancia')} />
            <TextArea label="Doenças importantes na infância/adolescência" name="doencasInfancia" value={data.infancia.doencasInfancia} onChange={update('infancia')} />
            <TextArea label="Cirurgias na infância/adolescência" name="cirurgiasInfancia" value={data.infancia.cirurgiasInfancia} onChange={update('infancia')} />
            <Select label="Teve epilepsia?" options={['Sim', 'Não']} name="epilepsia" value={data.infancia.epilepsia} onChange={update('infancia')} />
            <TextArea label="Traumatismos importantes" subLabel="Acidentes, quedas, fraturas, TC..." name="traumatismosInfancia" value={data.infancia.traumatismosInfancia} onChange={update('infancia')} />
          </FormSection>

          <FormSection title="4.4.2 Idade Adulta e Madura" isActive={activeSection === Section.ADULTHOOD}>
            <TextArea label="Traumatismos importantes" subLabel="Acidentes, atropelamento, quedas..." name="traumatismos" value={data.idadeAdulta.traumatismos} onChange={update('idadeAdulta')} />
            <TextArea label="Doenças e cirurgias importantes" name="doencasCirurgias" value={data.idadeAdulta.doencasCirurgias} onChange={update('idadeAdulta')} />
            <TextArea label="Tratamentos clínicos realizados" name="tratamentos" value={data.idadeAdulta.tratamentos} onChange={update('idadeAdulta')} />
            <TextArea label="Antecedentes psiquiátricos" subLabel="Ambulatorial, internação, medicamentos..." name="antecedentesPsiquiatricos" value={data.idadeAdulta.antecedentesPsiquiatricos} onChange={update('idadeAdulta')} />
            
            <Select label="É fumante?" subLabel="Cigarro, cachimbo, charuto" options={['Sim', 'Não', 'Ex-fumante']} name="fumante" value={data.idadeAdulta.fumante} onChange={update('idadeAdulta')} />
            <Input label="Uso de álcool" placeholder="Frequência e quantidade" name="alcool" value={data.idadeAdulta.alcool} onChange={update('idadeAdulta')} />
            
            <Input label="Atividades físicas/esportivas" placeholder="Quais e frequência" name="atividadeFisica" value={data.idadeAdulta.atividadeFisica} onChange={update('idadeAdulta')} />
            <TextArea label="Padrão atual do sono" name="sono" value={data.idadeAdulta.sono} onChange={update('idadeAdulta')} />
            <TextArea label="Padrão nutricional atual" subLabel="Obesidade, magreza, dietas, distúrbios..." name="nutricional" value={data.idadeAdulta.nutricional} onChange={update('idadeAdulta')} />
          </FormSection>

          <FormSection title="4.4.3 Interação Social" isActive={activeSection === Section.SOCIAL}>
            <TextArea label="Relacionamento com familiares" subLabel="Pais, irmãos..." name="relacaoFamilia" value={data.social.relacaoFamilia} onChange={update('social')} />
            <TextArea label="Amigos de infância/adolescência" name="amigosInfancia" value={data.social.amigosInfancia} onChange={update('social')} />
            <TextArea label="Amigos na idade adulta/atual" name="amigosAdulto" value={data.social.amigosAdulto} onChange={update('social')} />
            <TextArea label="Desempenho escolar (infância/adolescência)" name="escolaInfancia" value={data.social.escolaInfancia} onChange={update('social')} />
            <TextArea label="Desempenho ensino médio/superior" name="ensinoSuperior" value={data.social.ensinoSuperior} onChange={update('social')} />
            <Input label="Cursos que participou" name="cursos" value={data.social.cursos} onChange={update('social')} />
            <TextArea label="Atividades profissionais apto a exercer" className="border-l-4 border-primary-400" name="atividadesProfissionaisAptidao" value={data.social.atividadesProfissionaisAptidao} onChange={update('social')} />
            
            <Input label="Primeiro emprego" subLabel="Tipo, data, período" name="primeiroEmprego" value={data.social.primeiroEmprego} onChange={update('social')} />
            <Input label="Emprego atual" subLabel="Há quanto tempo" name="empregoAtual" value={data.social.empregoAtual} onChange={update('social')} />
            <Input label="Relacionamento com colegas" name="relacaoTrabalho" value={data.social.relacaoTrabalho} onChange={update('social')} />
            
            <TextArea label="Matrimônio/Relacionamentos" subLabel="Datas, conflitos, filhos, número de uniões..." name="matrimonio" value={data.social.matrimonio} onChange={update('social')} />
            <Input label="Atividades de lazer" name="lazer" value={data.social.lazer} onChange={update('social')} />
            <Input label="Associações, clubes, partidos" name="associacoes" value={data.social.associacoes} onChange={update('social')} />
          </FormSection>

          <FormSection title="4.5 Antecedentes Familiares" isActive={activeSection === Section.FAMILY}>
            <Input label="Idade atual dos pais" name="idadePais" value={data.familia.idadePais} onChange={update('familia')} />
            <TextArea label="Status civil dos pais" subLabel="Unidos? Separados? Desde quando?" name="paisUnidos" value={data.familia.paisUnidos} onChange={update('familia')} />
            <TextArea label="Vivos ou falecidos?" subLabel="Especificar quem" name="paisVivos" value={data.familia.paisVivos} onChange={update('familia')} />
            <TextArea label="Se falecidos" subLabel="Causa e idade do óbito" name="causaMortePais" value={data.familia.causaMortePais} onChange={update('familia')} />
            <Input label="Idade do paciente ao óbito dos pais" name="idadePacienteMortePais" value={data.familia.idadePacienteMortePais} onChange={update('familia')} />
            
            <Select label="Classe socioeconômica dos pais" options={['A (Alta)', 'B (Média)', 'C (Média-baixa)', 'D (Baixa)']} name="classeSocialPais" value={data.familia.classeSocialPais} onChange={update('familia')} />
            <Select label="Mudança de classe social?" options={['Subiu', 'Baixou', 'Manteve']} name="mudancaSocial" value={data.familia.mudancaSocial} onChange={update('familia')} />
            <Select label="Família imigrante/emigrante?" options={['Sim (Imigrante)', 'Sim (Emigrante)', 'Não']} name="migracao" value={data.familia.migracao} onChange={update('familia')} />
            
            <Input label="Ocupação dos pais" name="ocupacaoPais" value={data.familia.ocupacaoPais} onChange={update('familia')} />
            <Input label="Escolaridade dos pais" name="escolaridadePais" value={data.familia.escolaridadePais} onChange={update('familia')} />
            
            <TextArea label="Doença mental nos pais?" name="doencaMentalPais" value={data.familia.doencaMentalPais} onChange={update('familia')} />
            <TextArea label="Dependência química nos pais?" name="dependenciaPais" value={data.familia.dependenciaPais} onChange={update('familia')} />
            <TextArea label="Doenças genéticas nos pais?" name="geneticaPais" value={data.familia.geneticaPais} onChange={update('familia')} />
            <TextArea label="Histórico de violência doméstica?" name="violenciaDomestica" value={data.familia.violenciaDomestica} onChange={update('familia')} />
            
            <div className="md:col-span-2 border-t pt-4 mt-2 mb-2">
              <h3 className="font-semibold text-slate-700">Outros Parentes</h3>
            </div>
            
            <TextArea label="Doença mental em parentes?" subLabel="Especificar grau" name="doencaMentalParentes" value={data.familia.doencaMentalParentes} onChange={update('familia')} />
            <TextArea label="Doenças genéticas em parentes?" name="geneticaParentes" value={data.familia.geneticaParentes} onChange={update('familia')} />
            <TextArea label="Traços de personalidade patológicos?" subLabel="Agressividade, manipulação, etc. (Pais/Parentes)" name="tracosPersonalidade" value={data.familia.tracosPersonalidade} onChange={update('familia')} />
            <TextArea label="Antecedentes de suicídio?" name="suicidioFamilia" value={data.familia.suicidioFamilia} onChange={update('familia')} />
            <TextArea label="Antecedentes de vícios/jogos?" name="viciosFamilia" value={data.familia.viciosFamilia} onChange={update('familia')} />
            <TextArea label="Conduta antissocial/criminosa?" name="condutaAntissocial" value={data.familia.condutaAntissocial} onChange={update('familia')} />
            <TextArea label="Parente preso?" subLabel="Quem e motivo" name="parentesPresos" value={data.familia.parentesPresos} onChange={update('familia')} />
          </FormSection>

          {activeSection === Section.FINISH && (
             <div className="animate-fade-in space-y-8">
               
               {!patientFinished ? (
                 <div className="text-center space-y-6 max-w-2xl mx-auto py-8">
                   <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                     <CheckCircleIcon className="w-10 h-10 text-primary-600" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800">Você chegou ao final</h2>
                   <p className="text-slate-600">
                     Obrigado por preencher o formulário. Antes de enviar, certifique-se de que todas as informações estão corretas. 
                     Clique no botão abaixo para concluir e gerar o seu código de resposta.
                   </p>
                   
                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={handlePatientFinish}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1 flex items-center justify-center gap-2"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                      Concluir Preenchimento
                    </button>
                   </div>

                   <hr className="border-slate-200 my-6" />
                   
                   <div className="bg-slate-50 p-4 rounded-lg text-left">
                    <p className="text-sm font-semibold text-slate-700 mb-1">Para o Médico/Pesquisador:</p>
                    <p className="text-sm text-slate-500 mb-2">Se você precisa do link em branco para enviar a um novo paciente, copie o link abaixo:</p>
                    <div className="flex gap-2">
                      <input 
                        readOnly 
                        value={window.location.href.split('#')[0]} 
                        className="flex-1 bg-white border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-500 font-mono"
                      />
                      <button 
                        onClick={() => copyToClipboard(window.location.href.split('#')[0], 'blank')}
                        className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700 text-xs font-medium"
                      >
                        {copySuccess === 'blank' ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                   </div>
                 </div>
               ) : (
                 <div className="bg-green-50 border border-green-200 rounded-xl p-6 md:p-8 space-y-6">
                   <div className="flex items-center gap-4 text-green-800 border-b border-green-200 pb-4">
                     <CheckCircleIcon className="w-8 h-8" />
                     <div>
                       <h3 className="text-xl font-bold">Respostas Salvas com Sucesso!</h3>
                       <p className="text-sm">Agora você precisa enviar seus dados para o médico.</p>
                     </div>
                   </div>

                   <div className="space-y-4">
                     <h4 className="font-semibold text-slate-800">Escolha uma forma de enviar:</h4>
                     
                     {/* Option 1: File Download (Safest) */}
                     <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-primary-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <DocumentArrowDownIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-slate-800">Opção 1: Baixar Arquivo (Recomendado)</h5>
                            <p className="text-sm text-slate-600 mb-3">
                              Baixe um arquivo com suas respostas e envie por WhatsApp ou E-mail para o médico.
                              <span className="block mt-1 text-xs text-blue-600 font-medium">Melhor opção se o link não funcionar.</span>
                            </p>
                            <button
                              onClick={handleDownload}
                              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                            >
                              Baixar Respostas
                            </button>
                          </div>
                        </div>
                     </div>

                     {/* Option 2: Link (If not blob) */}
                     <div className={`bg-white p-4 rounded-lg border border-slate-200 shadow-sm ${isBlobUrl ? 'opacity-60 grayscale' : 'hover:border-primary-300'} transition-colors`}>
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <LinkIcon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h5 className="font-bold text-slate-800">Opção 2: Enviar Link</h5>
                            <p className="text-sm text-slate-600 mb-3">
                              Copie o link abaixo e envie para o médico. 
                              {isBlobUrl && <span className="text-red-600 font-bold ml-1">(Pode não funcionar neste ambiente de teste!)</span>}
                            </p>
                            <div className="flex gap-2">
                              <input 
                                readOnly 
                                value={generatedLink || ''} 
                                className="flex-1 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-500 font-mono truncate"
                              />
                              <button 
                                onClick={() => generatedLink && copyToClipboard(generatedLink, 'review')}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 text-purple-700 text-sm font-medium transition-colors"
                              >
                                {copySuccess === 'review' ? 'Copiado!' : 'Copiar Link'}
                              </button>
                            </div>
                          </div>
                        </div>
                     </div>

                   </div>
                 </div>
               )}
             </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
             {activeSection !== Section.IDENTIFICATION && (
               <button 
                 onClick={() => {
                   const idx = TABS.findIndex(t => t.id === activeSection);
                   if(idx > 0) setActiveSection(TABS[idx - 1].id);
                   else if(activeSection === Section.FINISH) setActiveSection(TABS[TABS.length - 1].id);
                 }}
                 className="text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center gap-1"
               >
                 &larr; Voltar
               </button>
             )}
             
             {activeSection !== Section.FINISH && (
               <button 
                 onClick={() => {
                   const idx = TABS.findIndex(t => t.id === activeSection);
                   if(idx < TABS.length - 1) setActiveSection(TABS[idx + 1].id);
                   else setActiveSection(Section.FINISH);
                 }}
                 className="ml-auto bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
               >
                 Próximo &rarr;
               </button>
             )}
          </div>

        </div>
      </main>
    </div>
  );
}
