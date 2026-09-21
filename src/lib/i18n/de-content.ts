import type { CustomerResultDraft, CustomerStoryDraft } from '../content/customer-stories';
import type { Solution, SolutionControl, SolutionQuestion } from '../content/solutions';
import type { SolutionSlug, StaticRouteKey } from './routes';

export interface GermanSection {
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  points?: readonly string[];
}

export interface GermanStaticPage {
  title: string;
  description: string;
  eyebrow: string;
  headline: string;
  intro: string;
  sections: readonly GermanSection[];
}

export const germanStaticPages: Partial<Record<StaticRouteKey, GermanStaticPage>> = {
  home: {
    title: 'KI-Agenten, die Ihre Teams wirklich nutzen | Zeno',
    description:
      'Finden Sie wertvolle Workflows und entwickeln Sie Agenten mit den Menschen, die sie nutzen. Steigern Sie die Nutzung in einem kontrollierten Workspace für Europa.',
    eyebrow: 'Enterprise AI',
    headline: 'KI-Agenten, die Ihre Teams wirklich nutzen.',
    intro:
      'Wählen Sie einen vorgefertigten Agenten oder gestalten Sie Ihren eigenen. Wir verankern ihn in Ihrem Unternehmenskontext und begleiten die Einführung.',
    sections: [
      {
        eyebrow: '01 / Finden',
        title: 'Beginnen Sie mit der Arbeit, die wirklich Zeit kostet.',
        paragraphs: [
          'Wir betrachten wiederkehrende Aufgaben, vorhandenes Wissen und die Menschen, die das Ergebnis verantworten.',
          'So wird aus einem allgemeinen KI-Vorhaben ein klarer erster Workflow.',
        ],
      },
      {
        eyebrow: '02 / Entwickeln',
        title: 'Starten Sie vorgefertigt oder passend zu Ihrem Prozess.',
        paragraphs: [
          'Nutzen Sie einen vorhandenen Agenten als Ausgangspunkt oder bauen Sie einen Agenten um Ihren eigenen Ablauf.',
          'Der Agent arbeitet mit Ihren freigegebenen Systemen und gibt das Ergebnis zur Prüfung zurück.',
        ],
      },
      {
        eyebrow: '03 / Einführen',
        title: 'Machen Sie aus dem ersten Einsatz tägliche Arbeit.',
        paragraphs: [
          'Wir bleiben nach dem Start dabei. Gemeinsam verbessern wir, was Teams nutzen, und erweitern, was funktioniert.',
        ],
      },
      {
        eyebrow: 'Kunden',
        title: 'Erfahrungen aus realer Arbeit.',
        paragraphs: [
          'Kunden nutzen verbundene Wissensquellen und fokussierte Agenten für Recherche, Berichte, Angebote und technische Arbeit.',
        ],
      },
      {
        eyebrow: 'Sicherheit und Kontrolle',
        title: 'Regeln bleiben nah an der Arbeit.',
        paragraphs: [
          'Steuern Sie Wissenszugriff, freigegebene Modelle und menschliche Prüfschritte in einem gemeinsamen Workspace.',
        ],
      },
    ],
  },
  product: {
    title: 'Produkt | Zeno',
    description:
      'Enterprise AI mit Unternehmenswissen, vorgefertigten oder individuellen Agenten, wichtigen Modellen mit EU-Hosting und kontrollierten Workspaces.',
    eyebrow: 'Produkt',
    headline: 'Enterprise AI für Ihr Unternehmen.',
    intro:
      'Arbeiten Sie im Chat, verbinden Sie Unternehmenswissen und überführen Sie wiederkehrende Aufgaben in sichtbare Abläufe.',
    sections: [
      {
        eyebrow: 'Chat',
        title: 'Beginnen Sie mit der Aufgabe vor Ihnen.',
        paragraphs: [
          'Wählen Sie einen Agenten, geben Sie die Aufgabe ein und arbeiten Sie mit dem relevanten Unternehmenskontext.',
        ],
      },
      {
        eyebrow: 'Agenten',
        title: 'Vorgefertigt starten oder individuell aufbauen.',
        paragraphs: [
          'Nutzen Sie Agenten für Präsentationen, Finanzen und Recht als Ausgangspunkt. Gestalten Sie eigene Agenten für besondere Prozesse.',
        ],
      },
      {
        eyebrow: 'Wissen',
        title: 'Verbinden Sie den Kontext, den Ihre Teams bereits nutzen.',
        paragraphs: [
          'Wissensdatenbanken können über MCP-Connectoren mit vorhandenen Systemen verbunden werden.',
        ],
      },
      {
        eyebrow: 'Kontrollierter Workspace',
        title: 'Behalten Sie Regeln und Arbeit an einem Ort.',
        paragraphs: [
          'Steuern Sie Wissenszugriff, Modellwahl, menschliche Prüfschritte und die Nutzung im Workspace.',
          'Greifen Sie an einem Ort auf wichtige KI-Modelle mit EU-Hosting zu.',
        ],
      },
    ],
  },
  pricing: {
    title: 'Business Case Rechner | Zeno',
    description:
      'Wählen Sie die Arbeit, die Ihr Team Zeit kostet, und schätzen Sie den möglichen jährlichen Zeitwert für einen fokussierten Pilotversuch.',
    eyebrow: 'Business Case',
    headline: 'Was könnte Ihr Team zurückgewinnen?',
    intro:
      'Wählen Sie die Arbeit, die Zeit kostet. Ergänzen Sie einen groben Wochenwert. Erhalten Sie eine Planungsschätzung und einen fokussierten Pilotvorschlag.',
    sections: [
      {
        eyebrow: 'Enterprise Plan',
        title: 'Der Preis richtet sich nach der Einführung.',
        paragraphs: [
          'Planen Sie die Plattform passend zu Teams und Workflows. Ergänzen Sie verbundene Systeme und Kontrollen nach Bedarf.',
        ],
        points: ['Personen', 'Workflows', 'Systeme', 'Kontrollen'],
      },
    ],
  },
  security: {
    title: 'Sicherheit und Compliance | Zeno',
    description:
      'Erfahren Sie mehr über Workspace-Kontrollen, unabhängige Prüfungen, Datenschutz und Hosting-Optionen für Zeno.',
    eyebrow: 'Sicherheit',
    headline: 'Skalieren Sie KI, ohne Kontrolle abzugeben.',
    intro:
      'Steuern Sie Wissenszugriff, freigegebene Modelle und menschliche Prüfschritte in einem kontrollierten Workspace.',
    sections: [
      {
        eyebrow: 'Zertifizierungen und Datenschutz',
        title: 'Sicherheit, die Sie überprüfen können.',
        paragraphs: [
          'ISO 27001, SOC 2 Type I, SOC 2 Type II und das Datenschutzprogramm gehören zu Text Cortex AI, dem Unternehmen hinter Zeno.',
        ],
        points: [
          'ISO 27001: Zertifiziertes Informationssicherheitsmanagement.',
          'SOC 2 Type I: Unabhängiger Bericht zum Aufbau der Kontrollen.',
          'SOC 2 Type II: Unabhängiger Bericht zur Wirksamkeit der Kontrollen.',
          'DSGVO: Verarbeitung personenbezogener Daten im Einklang mit der DSGVO und anwendbarem nationalem Datenschutzrecht.',
        ],
      },
      {
        eyebrow: 'Workspace-Kontrollen',
        title: 'Halten Sie Regeln nah an der Arbeit.',
        paragraphs: [
          'Verwalten Sie, wer verbundenes Unternehmenswissen nutzen kann. Wählen Sie freigegebene Modelle und halten Sie Prüfung und Freigabe im Workflow.',
          'Eine dedizierte Single-Tenant-Infrastruktur ist zusätzlich zur geteilten Bereitstellung verfügbar.',
        ],
      },
      {
        eyebrow: 'Trust Center',
        title: 'Von der Übersicht zu den Zertifizierungen.',
        paragraphs: [
          'Im öffentlichen Trust Center finden Sie Zertifizierungen, Richtlinien, Kontrollen, Dokumente und Subprozessoren.',
        ],
      },
    ],
  },
  demo: {
    title: 'Demo buchen | Zeno',
    description:
      'Bringen Sie einen Enterprise-Workflow mit und vereinbaren Sie ein vorbereitetes Gespräch mit Zeno.',
    eyebrow: 'Demo buchen',
    headline: 'Bringen Sie uns einen Workflow.',
    intro:
      'Sagen Sie uns, was Sie verbessern möchten. Wir bereiten das Gespräch rund um Ihr Team, Ihre Systeme und Ihre Kontrollen vor.',
    sections: [
      {
        eyebrow: 'Wie es weitergeht',
        title: 'Ein vorbereitetes Gespräch.',
        paragraphs: [
          'Wir prüfen den Workflow und Ihren Ausgangspunkt.',
          'Wir bereiten die wichtigsten Fragen zu Umsetzung und Kontrolle vor.',
          'Anschließend schlagen wir einen passenden nächsten Schritt vor.',
        ],
      },
    ],
  },
  solutions: {
    title: 'Enterprise AI Lösungen nach Branche | Zeno',
    description:
      'Entdecken Sie Zeno für Fertigung, Unternehmensberatung, M&A, Private Equity und Recht.',
    eyebrow: 'Lösungen',
    headline: 'Der gleiche Workspace. Ihre Arbeit.',
    intro:
      'Ein kontrollierter Workspace. Agenten arbeiten mit Ihrem Unternehmenskontext und bereiten Dokumente vor, die Ihre Teams bereits verantworten.',
    sections: [],
  },
};

export interface GermanSolutionContent {
  navLabel: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  summary: string;
  metaDescription: string;
  journey: readonly { title: string; description: string }[];
  workspace: {
    task: string;
    resultTitle: string;
    resultItems: readonly string[];
    reviewer: string;
  };
  workTitle: string;
  workBody: string;
  agents: readonly { name: string; does: string; from: string }[];
  wallsTitle: string;
  wallsBody: string;
  controls: readonly SolutionControl[];
  questionsTitle: string;
  questions: readonly SolutionQuestion[];
  closing: string;
}

export const germanSolutions: Record<SolutionSlug, GermanSolutionContent> = {
  manufacturing: {
    navLabel: 'Fertigung',
    eyebrow: 'Fertigung',
    headline: 'Die Dokumentation rund um das Bauteil.',
    subhead:
      'Entwerfen Sie Qualitätsberichte und prüfen Sie Spezifikationen anhand Ihrer technischen Unterlagen. Der verantwortliche Ingenieur prüft das Ergebnis.',
    summary: 'Qualitätsberichte und Spezifikationsprüfungen auf Basis technischer Unterlagen.',
    metaDescription:
      'Zeno für die Fertigung. Erstellen Sie 8D- und CAPA-Berichte, vergleichen Sie Spezifikationen und beantworten Sie Qualitätsfragen in einem kontrollierten Workspace.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Verbinden Sie Zeichnungen, Standards und Qualitätsunterlagen.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Wählen Sie einen vorgefertigten Agenten oder bauen Sie einen eigenen.',
      },
      {
        title: 'Prüfbare Arbeit',
        description: 'Der Vergleich geht mit allen Fundstellen an den verantwortlichen Ingenieur.',
      },
    ],
    workspace: {
      task: 'Vergleiche die aktuelle Kundenzeichnung mit unserem internen Standard.',
      resultTitle: 'Anforderungsvergleich',
      resultItems: [
        'Positionstoleranz muss geprüft werden',
        'Werkstoffspezifikation weicht ab',
        'Oberflächenangabe stimmt überein',
      ],
      reviewer: 'Verantwortlicher Ingenieur',
    },
    workTitle: 'Ein Agent pro Dokument, nicht ein Assistent für das ganze Werk.',
    workBody:
      'Geben Sie jedem Agenten ein Dokument, freigegebene Unterlagen und eine benannte Person für die Prüfung.',
    agents: [
      {
        name: 'Lieferantenqualitäts-Agent',
        does: 'Erstellt einen 8D-Entwurf aus Reklamation und relevanten Qualitätsunterlagen.',
        from: 'Reklamationen, frühere 8D- und CAPA-Dateien sowie Lieferantenunterlagen',
      },
      {
        name: 'Spezifikations-Agent',
        does: 'Vergleicht Kundenzeichnungen mit Ihrem Standard und belegt jede Abweichung.',
        from: 'Kundenzeichnungen, Spezifikationen und interne Standards',
      },
      {
        name: 'Angebots-Agent',
        does: 'Erstellt einen RFQ-Entwurf aus Kostenvorlagen und früheren Angeboten.',
        from: 'RFQ-Unterlagen, Kostenvorlagen und frühere Angebote',
      },
      {
        name: 'Schichtbericht-Agent',
        does: 'Erstellt aus Liniendaten und Schichtnotizen einen Bericht.',
        from: 'Liniendaten, Stillstandsaufzeichnungen und Schichtnotizen',
      },
    ],
    wallsTitle: 'Was ein Agent in der Fertigung niemals tun darf.',
    wallsBody:
      'Kundenzeichnungen, Lieferantenpreise und exportkontrollierte Teile brauchen unterschiedliche Zugriffsregeln.',
    controls: [
      {
        label: 'Programmzugriff',
        value: 'Ein Agent für ein Kundenprogramm kann kein anderes Programm lesen.',
      },
      {
        label: 'Kontrollierte Zeichnungen',
        value: 'Exportkontrollierte Inhalte bleiben in der freigegebenen Gruppe.',
      },
      {
        label: 'Kaufmännischer Zugriff',
        value: 'Lieferantenpreise bleiben im Einkauf.',
      },
      {
        label: 'Menschliche Prüfung',
        value: 'Jedes Qualitätsdokument geht an den verantwortlichen Ingenieur.',
      },
    ],
    questionsTitle: 'Was Qualität und Werks-IT zuerst fragen.',
    questions: [
      {
        question: 'Arbeitet der Agent mit unseren Zeichnungen?',
        answer:
          'Ja. Er nutzt die verbundenen Standards, Lieferantenunterlagen und früheren Berichte. Fundstellen verweisen auf diese Unterlagen.',
      },
      {
        question: 'Wie werden Zeichnungen unter NDA behandelt?',
        answer:
          'Die IT steuert den Zugriff und genehmigt die Modelle im Workspace. EU-Hosting ist für die Modellschicht verfügbar.',
      },
      {
        question: 'Kann der Agent ein Qualitätsdokument freigeben?',
        answer: 'Nein. 8D- und CAPA-Berichte gehen zur Prüfung an einen benannten Ingenieur.',
      },
      {
        question: 'Wie beginnt die Einführung?',
        answer:
          'Starten Sie mit einem Dokumenttyp in einem Werk. Erweitern Sie nach der fachlichen Prüfung.',
      },
    ],
    closing: 'Beginnen Sie mit dem Bericht, den Ihr Qualitätsteam am häufigsten erstellt.',
  },
  'management-consulting': {
    navLabel: 'Unternehmensberatung',
    eyebrow: 'Unternehmensberatung',
    headline: 'Die Arbeit zwischen den Terminen.',
    subhead:
      'Erstellen Sie Angebote und Kundenunterlagen aus dem Wissen Ihrer Beratung. Halten Sie jedes Mandat getrennt.',
    summary: 'Angebote und Kundenunterlagen auf Basis des Beratungswissens.',
    metaDescription:
      'Zeno für Unternehmensberatungen. Erstellen Sie Angebote, fassen Sie Interviews zusammen und bauen Sie Kundenunterlagen mit mandatsbezogenem Zugriff.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Verbinden Sie Briefing, Referenzen und passende frühere Projekte.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Wählen Sie einen vorgefertigten Agenten oder bauen Sie einen eigenen.',
      },
      {
        title: 'Prüfbare Arbeit',
        description: 'Der Entwurf geht mit Quellen und offenen Punkten an das Projektteam.',
      },
    ],
    workspace: {
      task: 'Erstelle einen Angebotsentwurf aus Briefing, Referenzen und relevanter Projekterfahrung.',
      resultTitle: 'Angebotsentwurf',
      resultItems: [
        'Passende Referenzen ergänzt',
        'Arbeitspakete strukturiert',
        'Offene Annahmen markiert',
      ],
      reviewer: 'Verantwortlicher Partner',
    },
    workTitle: 'Bereiten Sie die Arbeit vor, die Beratung bleibt beim Team.',
    workBody:
      'Agenten sammeln Material, strukturieren Entwürfe und verweisen auf Quellen. Berater entscheiden.',
    agents: [
      {
        name: 'Angebots-Agent',
        does: 'Erstellt einen ersten Angebotsentwurf aus Briefing und Referenzen.',
        from: 'Briefings, Referenzen und frühere Angebote',
      },
      {
        name: 'Interview-Agent',
        does: 'Bündelt Interviewnotizen zu Themen und offenen Fragen.',
        from: 'Interviewnotizen und freigegebene Projektunterlagen',
      },
      {
        name: 'Research-Agent',
        does: 'Strukturiert Markt- und Unternehmensrecherche für das Projektteam.',
        from: 'Freigegebene Quellen und internes Branchenwissen',
      },
      {
        name: 'Steering-Agent',
        does: 'Erstellt einen Statusentwurf aus Arbeitspaketen und Entscheidungen.',
        from: 'Projektstatus, Entscheidungen und Risiken',
      },
    ],
    wallsTitle: 'Mandatsgrenzen bleiben bestehen.',
    wallsBody:
      'Projektwissen, Preisgestaltung und personenbezogene Interviewdaten brauchen klare Zugriffsgrenzen.',
    controls: [
      {
        label: 'Mandatszugriff',
        value: 'Teams sehen nur die Projekte, für die sie freigegeben sind.',
      },
      { label: 'Referenzen', value: 'Nur freigegebene Referenzen fließen in Angebote ein.' },
      { label: 'Modelle', value: 'Die IT legt die verfügbaren Modelle fest.' },
      { label: 'Prüfung', value: 'Ein benannter Berater verantwortet jedes Kundenergebnis.' },
    ],
    questionsTitle: 'Was Partner und IT zuerst fragen.',
    questions: [
      {
        question: 'Bleiben Kundenprojekte voneinander getrennt?',
        answer: 'Ja. Zugriff wird pro Workspace, Wissensquelle und Mandat gesteuert.',
      },
      {
        question: 'Woher kommen die Referenzen im Entwurf?',
        answer: 'Aus den verbundenen und für diesen Zweck freigegebenen Unterlagen.',
      },
      {
        question: 'Wer prüft das Ergebnis?',
        answer: 'Das verantwortliche Projektteam prüft Quellen, Annahmen und Aussagen.',
      },
      {
        question: 'Wie starten wir?',
        answer: 'Beginnen Sie mit einem wiederkehrenden Angebot oder Kundenbericht.',
      },
    ],
    closing: 'Beginnen Sie mit dem Angebot, das Ihr Team regelmäßig neu aufbaut.',
  },
  'm-and-a': {
    navLabel: 'M&A',
    eyebrow: 'M&A',
    headline: 'Mehr Zeit für das Urteil hinter dem Deal.',
    subhead:
      'Finden Sie Zielunternehmen und bereiten Sie qualifizierte Longlists vor. Berater prüfen jeden Kandidaten.',
    summary: 'Zielsuche und qualifizierte Longlists für M&A-Teams.',
    metaDescription:
      'Zeno für M&A. Recherchieren Sie Zielunternehmen, erstellen Sie qualifizierte Longlists und bereiten Sie Outreach mit verbundenem Wissen vor.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Verbinden Sie Suchkriterien, Sektorerfahrung und frühere Mandate.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Wählen Sie einen vorgefertigten Agenten oder bauen Sie einen eigenen.',
      },
      {
        title: 'Prüfbare Arbeit',
        description: 'Die Longlist enthält Quellen, Fit-Hinweise und offene Fragen.',
      },
    ],
    workspace: {
      task: 'Finde Zielunternehmen anhand der freigegebenen Suchkriterien.',
      resultTitle: 'Qualifizierte Longlist',
      resultItems: ['Kriterien abgeglichen', 'Fit begründet', 'Offene Punkte markiert'],
      reviewer: 'Deal-Team',
    },
    workTitle: 'Recherche vorbereiten. Entscheidungen beim Deal-Team lassen.',
    workBody:
      'Agenten sammeln, vergleichen und strukturieren. Berater validieren jeden Kandidaten und jede Schlussfolgerung.',
    agents: [
      {
        name: 'Target-Discovery-Agent',
        does: 'Findet Unternehmen anhand definierter Suchkriterien.',
        from: 'Suchkriterien, Sektordaten und interne Deal-Erfahrung',
      },
      {
        name: 'Longlist-Agent',
        does: 'Erstellt Fit-Hinweise und markiert offene Fragen.',
        from: 'Unternehmensprofile, Marktdaten und interne Unterlagen',
      },
      {
        name: 'Teaser-Agent',
        does: 'Erstellt einen Teaser-Entwurf aus freigegebenem Mandatsmaterial.',
        from: 'Mandatsunterlagen und freigegebene Vorlagen',
      },
      {
        name: 'Outreach-Agent',
        does: 'Bereitet personalisierte Outreach-Entwürfe vor.',
        from: 'Kontaktkontext, Suchthese und freigegebene Vorlagen',
      },
    ],
    wallsTitle: 'Deal-Kontext bleibt beim richtigen Team.',
    wallsBody:
      'Mandate, Käuferlisten und vertrauliche Unternehmensdaten brauchen klare Zugriffsgrenzen.',
    controls: [
      { label: 'Mandatszugriff', value: 'Nur das Deal-Team kann das Mandat nutzen.' },
      { label: 'Quellen', value: 'Jeder Fit-Hinweis verweist auf seine Grundlage.' },
      { label: 'Outreach', value: 'Nachrichten bleiben Entwürfe bis zur Freigabe.' },
      { label: 'Signoff', value: 'Berater verantworten Longlist und Ansprache.' },
    ],
    questionsTitle: 'Was Deal-Teams zuerst fragen.',
    questions: [
      {
        question: 'Ersetzt der Agent die Marktbeurteilung?',
        answer: 'Nein. Er beschleunigt Recherche und Struktur. Die Beurteilung bleibt beim Team.',
      },
      {
        question: 'Kann er internes Wissen nutzen?',
        answer: 'Ja, wenn die entsprechenden Quellen verbunden und freigegeben sind.',
      },
      {
        question: 'Sind Longlists nachvollziehbar?',
        answer: 'Kandidaten werden mit Quellen, Kriterien und offenen Fragen zurückgegeben.',
      },
      {
        question: 'Wie starten wir?',
        answer:
          'Beginnen Sie mit einer klaren Suchthese und einer wiederkehrenden Rechercheaufgabe.',
      },
    ],
    closing: 'Beginnen Sie mit der Suche, die Ihr Deal-Team gerade von Hand aufbaut.',
  },
  'private-equity': {
    navLabel: 'Private Equity',
    eyebrow: 'Private Equity',
    headline: 'Der Investment-Memo vor dem Investment Committee.',
    subhead: 'Bereiten Sie Marktanalyse, Unternehmenskontext und offene Due-Diligence-Fragen vor.',
    summary: 'Investment-Memos und offene Due-Diligence-Fragen mit verbundenem Wissen.',
    metaDescription:
      'Zeno für Investment-Teams. Bereiten Sie Investment-Memos, Marktanalysen und offene Due-Diligence-Fragen in einem kontrollierten Workspace vor.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Verbinden Sie Pitch Deck, Fondsstrategie und frühere Investments.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Wählen Sie einen vorgefertigten Agenten oder bauen Sie einen eigenen.',
      },
      {
        title: 'Prüfbare Arbeit',
        description: 'Das Memo zeigt Quellen, Annahmen und offene Due-Diligence-Fragen.',
      },
    ],
    workspace: {
      task: 'Bereite einen Memo-Entwurf aus Pitch Deck und Marktunterlagen vor.',
      resultTitle: 'Investment-Memo',
      resultItems: ['Marktthese strukturiert', 'Annahmen markiert', 'Offene Fragen gesammelt'],
      reviewer: 'Investment-Team',
    },
    workTitle: 'Vom ersten Material zu einer prüfbaren Investment-Unterlage.',
    workBody:
      'Agenten strukturieren Unterlagen und Recherche. Das Investment-Team bewertet These und Risiko.',
    agents: [
      {
        name: 'Memo-Agent',
        does: 'Erstellt einen Memo-Entwurf aus Pitch Deck und Recherche.',
        from: 'Pitch Decks, Marktquellen und Fondsunterlagen',
      },
      {
        name: 'Diligence-Agent',
        does: 'Sammelt offene Fragen und verweist auf die relevanten Unterlagen.',
        from: 'Datenraum, Management-Unterlagen und frühere Prüfungen',
      },
      {
        name: 'Market-Agent',
        does: 'Strukturiert Marktgröße, Wettbewerb und zentrale Annahmen.',
        from: 'Freigegebene Marktquellen und interne Sektorerfahrung',
      },
      {
        name: 'Portfolio-Agent',
        does: 'Bereitet wiederkehrende Portfolio-Berichte vor.',
        from: 'KPI-Berichte, Board-Unterlagen und Portfoliokontext',
      },
    ],
    wallsTitle: 'Investment-Informationen bleiben innerhalb der richtigen Grenzen.',
    wallsBody:
      'Datenräume, Fondsinformationen und Portfoliozahlen brauchen rollenbasierte Zugriffe.',
    controls: [
      { label: 'Deal-Zugriff', value: 'Nur das zuständige Team sieht Deal-Unterlagen.' },
      { label: 'Fondsgrenzen', value: 'Fondsbezogenes Wissen bleibt getrennt.' },
      { label: 'Quellen', value: 'Aussagen im Memo verweisen auf die Grundlage.' },
      { label: 'Entscheidung', value: 'Das Investment Committee entscheidet.' },
    ],
    questionsTitle: 'Was Investment-Teams zuerst fragen.',
    questions: [
      {
        question: 'Kann der Agent ein Investment empfehlen?',
        answer: 'Er bereitet Informationen vor. Die Investmententscheidung bleibt beim Team.',
      },
      {
        question: 'Wie werden offene Fragen behandelt?',
        answer: 'Sie werden im Memo sichtbar markiert und mit den relevanten Quellen verbunden.',
      },
      {
        question: 'Kann bestehendes Fonds-Wissen einfließen?',
        answer: 'Ja, wenn es verbunden und für das Team freigegeben ist.',
      },
      {
        question: 'Wie starten wir?',
        answer: 'Beginnen Sie mit einem wiederkehrenden Memo oder einem Teil der Due Diligence.',
      },
    ],
    closing: 'Beginnen Sie mit dem Memo, das Ihr Team als Nächstes vorbereitet.',
  },
  legal: {
    navLabel: 'Recht',
    eyebrow: 'Recht',
    headline: 'Der erste Vertragsentwurf gegen Ihr eigenes Playbook.',
    subhead:
      'Prüfen Sie Verträge anhand Ihrer Klauseln und Richtlinien. Juristen behalten die Freigabe.',
    summary: 'Vertragsprüfung auf Basis des Playbooks Ihrer Kanzlei oder Rechtsabteilung.',
    metaDescription:
      'Zeno für Rechtsteams. Prüfen Sie Verträge gegen Ihr Playbook, erstellen Sie Klauselvorschläge und behalten Sie die juristische Freigabe.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Verbinden Sie Playbook, Vorlagen und freigegebene Präzedenzfälle.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Wählen Sie einen vorgefertigten Legal Agent oder bauen Sie einen eigenen.',
      },
      {
        title: 'Prüfbare Arbeit',
        description: 'Die Prüfung zeigt Abweichungen, Quellen und offene Entscheidungen.',
      },
    ],
    workspace: {
      task: 'Prüfe diesen Vertrag gegen unser freigegebenes Playbook.',
      resultTitle: 'Vertragsprüfung',
      resultItems: ['Abweichungen markiert', 'Playbook-Klauseln verknüpft', 'Entscheidungen offen'],
      reviewer: 'Verantwortlicher Jurist',
    },
    workTitle: 'Bereiten Sie die Prüfung vor. Lassen Sie die Rechtsberatung beim Juristen.',
    workBody:
      'Agenten vergleichen, markieren und entwerfen. Ein benannter Jurist prüft und entscheidet.',
    agents: [
      {
        name: 'Vertragsprüfungs-Agent',
        does: 'Vergleicht einen Vertrag mit dem freigegebenen Playbook.',
        from: 'Vertrag, Playbook und freigegebene Klauselbibliothek',
      },
      {
        name: 'Klausel-Agent',
        does: 'Schlägt passende Alternativklauseln zur Prüfung vor.',
        from: 'Klauselbibliothek und freigegebene Präzedenzfälle',
      },
      {
        name: 'Recherche-Agent',
        does: 'Strukturiert interne Rechtsrecherche und Fundstellen.',
        from: 'Freigegebene Wissensquellen und interne Vermerke',
      },
      {
        name: 'Mandats-Agent',
        does: 'Bereitet wiederkehrende Mandatsberichte vor.',
        from: 'Mandatsstatus, Aufgaben und freigegebene Korrespondenz',
      },
    ],
    wallsTitle: 'Mandatsgeheimnis bleibt eine harte Grenze.',
    wallsBody:
      'Mandate, sensible Dokumente und privilegierte Kommunikation brauchen klare Zugriffsregeln.',
    controls: [
      { label: 'Mandatszugriff', value: 'Nur das zuständige Team sieht Mandatsunterlagen.' },
      { label: 'Playbooks', value: 'Nur freigegebene Playbooks steuern die Prüfung.' },
      { label: 'Modelle', value: 'Die IT legt die verfügbaren Modelle fest.' },
      { label: 'Juristische Prüfung', value: 'Ein Jurist prüft jeden Entwurf vor der Nutzung.' },
    ],
    questionsTitle: 'Was Kanzleien und Rechtsabteilungen zuerst fragen.',
    questions: [
      {
        question: 'Erteilt der Agent Rechtsberatung?',
        answer:
          'Nein. Er bereitet eine Prüfung vor. Ein Jurist bewertet und genehmigt das Ergebnis.',
      },
      {
        question: 'Arbeitet er mit unserem Playbook?',
        answer: 'Ja, wenn das Playbook verbunden und für diesen Workspace freigegeben ist.',
      },
      {
        question: 'Bleiben Mandate getrennt?',
        answer: 'Zugriffe werden pro Workspace und Wissensquelle gesteuert.',
      },
      {
        question: 'Wie starten wir?',
        answer: 'Beginnen Sie mit einem Vertragstyp und einem klaren Playbook.',
      },
    ],
    closing: 'Beginnen Sie mit dem Vertrag, den Ihr Team am häufigsten prüft.',
  },
};

export interface GermanCustomerStory {
  title: string;
  summary: string;
  results: readonly CustomerResultDraft[];
  sections: readonly {
    label: string;
    heading: string;
    paragraphs: readonly string[];
    points?: readonly string[];
  }[];
}

export const germanCustomerStories: Record<string, GermanCustomerStory> = {
  atares: {
    title: 'Wie atares Zeit bei Recherche und Target-Suche spart.',
    summary:
      'atares nutzt verbundenes Wissen und spezialisierte Agenten für Recherche. Berater verantworten das endgültige Ergebnis.',
    results: [
      {
        claimId: 'customer-result-atares-weekly-time-de-draft',
        value: 'Rund 20 Stunden',
        label: 'spart das Team pro Woche',
        qualifier: 'Gesamtwert des Teams für Recherche-Workflows, nicht pro Person.',
      },
      {
        claimId: 'customer-result-atares-knowledge-bases-de-draft',
        value: '4',
        label: 'aktive Wissensdatenbanken',
        qualifier: 'Aktiv in der beschriebenen Einführung.',
      },
      {
        claimId: 'customer-result-atares-agents-de-draft',
        value: '7',
        label: 'aktive Agenten',
        qualifier: 'Aktiv in der beschriebenen Einführung.',
      },
    ],
    sections: [
      {
        label: 'Kundenkontext',
        heading: 'Ein M&A-Team, das auf fachliches Urteil setzt.',
        paragraphs: [
          'atares berät technologieorientierte Mittelstandsunternehmen bei Akquisitionen, Verkäufen und Wachstumsfinanzierungen.',
          'Ein Mandat beginnt oft mit breiter Recherche und wird zu einer Liste potenzieller Partner. Das Team wollte einen schnelleren ersten Durchlauf, keine fertige KI-Empfehlung.',
        ],
      },
      {
        label: 'Die Herausforderung',
        heading: 'Recherche war über mehrere Systeme verteilt.',
        paragraphs: [
          'Relevantes Wissen lag in Microsoft 365, Confluence und Marktquellen. Zielsuche und erste Analysen erforderten wiederholte manuelle Arbeit.',
        ],
        points: [
          'Markt- und Unternehmensrecherche',
          'Vorläufige Target- und Käuferlisten',
          'Erste Analysen zur Prüfung',
          'Vorbereitung von Outreach',
        ],
      },
      {
        label: 'Der Ansatz',
        heading: 'Verbundenes Wissen wurde zum Ausgangspunkt fokussierter Agenten.',
        paragraphs: [
          'atares baute vier aktive Wissensdatenbanken und sieben aktive Agenten in einem gemeinsamen Workspace auf.',
          'Jeder Agent hat eine klar definierte Rechercheaufgabe. Berater steuern Umfang, Zugriff und Ergebnis.',
        ],
      },
      {
        label: 'Workflows in der Praxis',
        heading: 'Schneller von der Frage zum prüfbaren Entwurf.',
        paragraphs: [
          'Bei einer Buy-Side-Suche prüft ein Agent Unternehmen anhand definierter Kriterien. Er erstellt eine erste Longlist und Fit-Hinweise. Berater validieren und kürzen die Liste.',
          'Agenten unterstützen außerdem frühe Szenarien, indikative Bewertungen, Teaser und Outreach-Entwürfe.',
        ],
      },
      {
        label: 'Ergebnis',
        heading: 'Mehr Zeit für Aufgaben, die einen Berater brauchen.',
        paragraphs: [
          'atares berichtet über rund 20 eingesparte Teamstunden pro Woche in den beschriebenen Recherche-Workflows.',
          'Berater prüfen jedes Ergebnis, bevor es das Team verlässt.',
        ],
      },
    ],
  },
  b2venture: {
    title: 'Wie b2venture KI in den Investment-Workflow gebracht hat.',
    summary:
      'b2venture nutzt fokussierte Agenten für Recherche und Investment-Arbeit. Das Team verfolgt die regelmäßige Nutzung.',
    results: [
      {
        claimId: 'customer-result-b2venture-activation-de-draft',
        value: 'Über 70 %',
        label: 'Aktivierung im Investment-Team',
        qualifier: 'Gemeldete Aktivierung in der beschriebenen Einführung.',
      },
      {
        claimId: 'customer-result-b2venture-usage-de-draft',
        value: '2×',
        label: 'Nutzung innerhalb von vier Monaten',
        qualifier: 'Die gemeldete Nutzung verdoppelte sich in diesem Zeitraum.',
      },
      {
        claimId: 'customer-result-b2venture-opportunity-time-de-draft',
        value: '5 bis 10 Stunden',
        label: 'früherer Aufwand pro Investment-Chance',
        qualifier: 'Qualifizierter Ausgangswert, keine garantierte Einsparung.',
      },
    ],
    sections: [
      {
        label: 'Kundenkontext',
        heading: 'Investment-Arbeit braucht Geschwindigkeit und analytische Tiefe.',
        paragraphs: [
          'b2venture prüft Unternehmen und Märkte, bevor Analysen in Investment-Unterlagen einfließen.',
          'Agenten übernehmen wiederkehrende Vorbereitung. Investment-Entscheidungen bleiben beim Team.',
        ],
      },
      {
        label: 'Die Herausforderung',
        heading: 'Memos und Marktrecherche beanspruchten dieselben knappen Stunden.',
        paragraphs: [
          'Pitch Decks, Marktinformationen und interne Unterlagen mussten für jede Chance neu zusammengeführt werden.',
        ],
      },
      {
        label: 'Der Ansatz',
        heading: 'Spezialisierte Agenten arbeiten mit verbundenem Investment-Wissen.',
        paragraphs: [
          'Notion und Google Drive liefern freigegebenen Kontext. Agenten unterstützen Pitch-Deck-Analyse, Markt- und Startup-Recherche sowie Kommunikation.',
        ],
      },
      {
        label: 'Workflows in der Praxis',
        heading: 'Ein nachvollziehbarer erster Entwurf für das Investment-Team.',
        paragraphs: [
          'Ein Agent strukturiert das Pitch Deck, ergänzt Marktkontext und markiert offene Fragen. Das Team prüft die These und vertieft die Due Diligence.',
        ],
      },
      {
        label: 'Ergebnis',
        heading: 'Regelmäßige Nutzung wurde Teil des Investment-Prozesses.',
        paragraphs: [
          'Die Einführung erreichte über 70 Prozent Aktivierung. Die Nutzung verdoppelte sich innerhalb von vier Monaten.',
          'Vor der Einführung beanspruchte eine Investment-Chance typischerweise fünf bis zehn Stunden dieser Vorbereitung.',
        ],
      },
    ],
  },
  mahle: {
    title: 'Wie MAHLE technisches Wissen leichter auffindbar gemacht hat.',
    summary:
      'MAHLE verbindet technische Quellen mit MARVIN, damit Teams Informationen finden, vergleichen und zusammenfassen können.',
    results: [
      {
        claimId: 'customer-result-mahle-activation-de-draft',
        value: 'Über 71 %',
        label: 'Aktivierung in weniger als einem Monat',
        qualifier: 'Gemeldete Aktivierung in der beschriebenen Einführung.',
      },
      {
        claimId: 'customer-result-mahle-time-de-draft',
        value: 'Mehr als 5 Stunden',
        label: 'pro Person und Woche eingespart',
        qualifier: 'Gemeldeter Zeitwert aus den beschriebenen Wissens-Workflows.',
      },
    ],
    sections: [
      {
        label: 'Kundenkontext',
        heading: 'Technisches Wissen war über Teams und Systeme verteilt.',
        paragraphs: [
          'Ingenieure und Fachbereiche arbeiten mit großen Mengen an technischem Wissen. Informationen lagen in SharePoint, Teams und weiteren Quellen.',
        ],
      },
      {
        label: 'Die Herausforderung',
        heading: 'Die richtige Information zu finden dauerte zu lange.',
        paragraphs: [
          'Teams mussten Dokumente durchsuchen, Versionen vergleichen und Inhalte erneut zusammenfassen.',
        ],
      },
      {
        label: 'Der Ansatz',
        heading: 'MARVIN verbindet technische Quellen mit fokussierten Aufgaben.',
        paragraphs: [
          'Synchronisierte SharePoint- und Teams-Quellen stellen freigegebenes Wissen bereit. Agenten helfen beim Vergleich und bei der Informationssuche.',
        ],
      },
      {
        label: 'Workflows in der Praxis',
        heading: 'Suchen, vergleichen und zusammenfassen in einem Workspace.',
        paragraphs: [
          'Teams nutzen MARVIN für technische Problemlösung, Dokumentvergleiche, Informationsabruf und Zusammenfassungen.',
        ],
      },
      {
        label: 'Ergebnis',
        heading: 'Schnelle Aktivierung und weniger Suchaufwand.',
        paragraphs: [
          'Die Einführung erreichte in weniger als einem Monat über 71 Prozent Aktivierung.',
          'MAHLE berichtet von mehr als fünf eingesparten Stunden pro Person und Woche.',
        ],
      },
    ],
  },
  kbc: {
    title: 'Wie KBC Unternehmenswissen leichter nutzbar gemacht hat.',
    summary:
      'KBC bündelt Wissen für Suche, Angebotserstellung und Onboarding in einem gemeinsamen Arbeitsbereich.',
    results: [
      {
        claimId: 'customer-result-kbc-search-de-draft',
        value: 'Von Minuten auf Sekunden',
        label: 'kürzere Suche',
        qualifier: 'Gemeldete Veränderung in den beschriebenen Wissens-Workflows.',
      },
      {
        claimId: 'customer-result-kbc-proposals-de-draft',
        value: '10 bis 12 %',
        label: 'effizientere Angebotserstellung',
        qualifier: 'Gemeldete Verbesserung im beschriebenen Angebotsprozess.',
      },
      {
        claimId: 'customer-result-kbc-weekly-usage-de-draft',
        value: 'Über 75 %',
        label: 'wöchentliche Nutzung nach 18 Monaten',
        qualifier: 'Gemeldete wöchentliche Nutzung nach 18 Monaten.',
      },
    ],
    sections: [
      {
        label: 'Kundenkontext',
        heading: 'Beratungswissen entstand in Projekten und Gesprächen.',
        paragraphs: [
          'KBC wollte informelles Wissen leichter auffindbar machen und in wiederkehrender Arbeit nutzen.',
        ],
      },
      {
        label: 'Die Herausforderung',
        heading: 'Manuelle Wissensdatenbanken hielten mit der Arbeit nicht Schritt.',
        paragraphs: [
          'Informationen mussten gepflegt, gesucht und für Angebote erneut zusammengestellt werden.',
        ],
      },
      {
        label: 'Der Ansatz',
        heading: 'Ein gemeinsamer Assistent bündelt freigegebenes Wissen.',
        paragraphs: [
          'Der Assistent Schorsch verbindet Wissen für Suche, Angebotserstellung und Onboarding. Metadaten helfen bei Struktur und Zugriff.',
        ],
      },
      {
        label: 'Workflows in der Praxis',
        heading: 'Wissen wird im Moment der Aufgabe verfügbar.',
        paragraphs: [
          'Teams suchen nach Projekterfahrung, bereiten Angebote vor und unterstützen neue Kolleginnen und Kollegen mit relevantem Kontext.',
        ],
      },
      {
        label: 'Ergebnis',
        heading: 'Schnellere Suche und anhaltende Nutzung.',
        paragraphs: [
          'Die Suche verkürzte sich von Minuten auf Sekunden. Die Angebotserstellung wurde um 10 bis 12 Prozent effizienter.',
          'Nach 18 Monaten lag die wöchentliche Nutzung bei über 75 Prozent.',
        ],
      },
    ],
  },
};

export function getGermanCustomerStory(story: CustomerStoryDraft): GermanCustomerStory {
  const translated = germanCustomerStories[story.slug];
  if (!translated) throw new Error('Missing German customer story for "' + story.slug + '".');
  return translated;
}

export function getGermanSolution(solution: Solution): GermanSolutionContent {
  const translated = germanSolutions[solution.slug as SolutionSlug];
  if (!translated) throw new Error('Missing German solution for "' + solution.slug + '".');
  return translated;
}
