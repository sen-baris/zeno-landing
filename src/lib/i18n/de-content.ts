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
    title: 'KI-Agenten, die Teams wirklich nutzen | Zeno',
    description:
      'Wertvolle Workflows finden und Agenten gemeinsam mit den Menschen entwickeln, die sie nutzen. So wächst die Nutzung in einem kontrollierten Workspace für Europa.',
    eyebrow: 'Enterprise AI',
    headline: 'KI-Agenten, die Teams wirklich nutzen.',
    intro:
      'Mit einem vorgefertigten Agenten beginnen oder einen eigenen gestalten. Wir verankern ihn im Unternehmenskontext und begleiten die Einführung.',
    sections: [
      {
        eyebrow: '01 / Finden',
        title: 'Mit der Arbeit beginnen, die wirklich Zeit kostet.',
        paragraphs: [
          'Wir betrachten wiederkehrende Aufgaben, vorhandenes Wissen und die Menschen, die das Ergebnis verantworten.',
          'So wird aus einem allgemeinen KI-Vorhaben ein klarer erster Workflow.',
        ],
      },
      {
        eyebrow: '02 / Entwickeln',
        title: 'Vorgefertigt beginnen oder passend zum Prozess aufbauen.',
        paragraphs: [
          'Ein vorhandener Agent dient als Ausgangspunkt. Alternativ entsteht ein Agent rund um den eigenen Ablauf.',
          'Der Agent arbeitet mit freigegebenen Systemen und gibt das Ergebnis zur Prüfung zurück.',
        ],
      },
      {
        eyebrow: '03 / Einführen',
        title: 'Aus dem ersten Einsatz wird tägliche Arbeit.',
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
          'Wissenszugriff, freigegebene Modelle und menschliche Prüfschritte bleiben in einem gemeinsamen Workspace steuerbar.',
        ],
      },
    ],
  },
  product: {
    title: 'Produkt | Zeno',
    description:
      'Enterprise AI mit Unternehmenswissen, vorgefertigten oder individuellen Agenten, wichtigen Modellen mit EU-Hosting und kontrollierten Workspaces.',
    eyebrow: 'Produkt',
    headline: 'Enterprise AI im Unternehmenskontext.',
    intro:
      'Im Chat beginnen, Unternehmenswissen verbinden und wiederkehrende Aufgaben in sichtbare Abläufe überführen.',
    sections: [
      {
        eyebrow: 'Chat',
        title: 'Mit der aktuellen Aufgabe beginnen.',
        paragraphs: [
          'Agent auswählen, Aufgabe eingeben und mit dem relevanten Unternehmenskontext arbeiten.',
        ],
      },
      {
        eyebrow: 'Agenten',
        title: 'Vorgefertigt starten oder individuell aufbauen.',
        paragraphs: [
          'Agenten für Präsentationen, Finanzen und Recht bieten einen direkten Ausgangspunkt. Eigene Agenten bilden besondere Prozesse ab.',
        ],
      },
      {
        eyebrow: 'Wissen',
        title: 'Den Kontext verbinden, den Teams bereits nutzen.',
        paragraphs: [
          'Wissensdatenbanken können über MCP-Connectoren mit vorhandenen Systemen verbunden werden.',
        ],
      },
      {
        eyebrow: 'Kontrollierter Workspace',
        title: 'Regeln und Arbeit bleiben an einem Ort.',
        paragraphs: [
          'Wissenszugriff, Modellwahl, menschliche Prüfschritte und Nutzung bleiben im Workspace steuerbar.',
          'Wichtige KI-Modelle mit EU-Hosting stehen an einem Ort bereit.',
        ],
      },
    ],
  },
  pricing: {
    title: 'Business-Case-Rechner | Zeno',
    description:
      'Zeitintensive Arbeit auswählen und den möglichen Jahreswert der zurückgewonnenen Zeit für einen fokussierten Piloten schätzen.',
    eyebrow: 'Business Case',
    headline: 'Was kann das Team zurückgewinnen?',
    intro:
      'Zeitintensive Arbeit auswählen, einen groben Wochenwert ergänzen und eine Planungsschätzung mit Pilotvorschlag erhalten.',
    sections: [
      {
        eyebrow: 'Enterprise-Plan',
        title: 'Der Preis richtet sich nach der Einführung.',
        paragraphs: [
          'Die Plattform richtet sich nach Teams und Workflows. Verbundene Systeme und Kontrollen kommen nach Bedarf hinzu.',
        ],
        points: ['Personen', 'Workflows', 'Systeme', 'Kontrollen'],
      },
    ],
  },
  security: {
    title: 'Sicherheit und Compliance | Zeno',
    description:
      'Workspace-Kontrollen, unabhängige Prüfungen, Datenschutz und Hosting-Optionen für Zeno im Überblick.',
    eyebrow: 'Sicherheit',
    headline: 'KI skalieren, ohne Kontrolle abzugeben.',
    intro:
      'Wissenszugriff, freigegebene Modelle und menschliche Prüfschritte bleiben in einem kontrollierten Workspace steuerbar.',
    sections: [
      {
        eyebrow: 'Zertifizierungen und Datenschutz',
        title: 'Sicherheit, die sich überprüfen lässt.',
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
        title: 'Regeln bleiben nah an der Arbeit.',
        paragraphs: [
          'Zugriff auf verbundenes Unternehmenswissen bleibt steuerbar. Freigegebene Modelle, Prüfung und Freigabe bleiben im Workflow.',
          'Eine dedizierte Single-Tenant-Infrastruktur ist zusätzlich zur gemeinsam genutzten Bereitstellung verfügbar.',
        ],
      },
      {
        eyebrow: 'Trust Center',
        title: 'Von der Übersicht zu den Zertifizierungen.',
        paragraphs: [
          'Das öffentliche Trust Center bündelt Zertifizierungen, Richtlinien, Kontrollen, Dokumente und Subprozessoren.',
        ],
      },
    ],
  },
  demo: {
    title: 'Demo buchen | Zeno',
    description:
      'Einen Enterprise-Workflow mitbringen und ein vorbereitetes Gespräch mit Zeno vereinbaren.',
    eyebrow: 'Demo buchen',
    headline: 'Ein Workflow reicht für den Anfang.',
    intro:
      'Ein kurzer Überblick über das gewünschte Ergebnis genügt. Wir bereiten das Gespräch rund um Team, Systeme und Kontrollen vor.',
    sections: [
      {
        eyebrow: 'Wie es weitergeht',
        title: 'Ein vorbereitetes Gespräch.',
        paragraphs: [
          'Wir prüfen den Workflow und den aktuellen Ausgangspunkt.',
          'Wir bereiten die wichtigsten Fragen zu Umsetzung und Kontrolle vor.',
          'Anschließend schlagen wir einen passenden nächsten Schritt vor.',
        ],
      },
    ],
  },
  solutions: {
    title: 'Enterprise AI Lösungen nach Branche | Zeno',
    description: 'Zeno für Fertigung, Unternehmensberatung, M&A, Private Equity und Recht.',
    eyebrow: 'Lösungen',
    headline: 'Der gleiche Workspace. Passend zur Arbeit.',
    intro:
      'Ein kontrollierter Workspace. Agenten arbeiten mit Unternehmenskontext und bereiten Dokumente vor, die Teams bereits verantworten.',
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
      'Qualitätsberichte entwerfen und Spezifikationen anhand technischer Unterlagen prüfen. Der verantwortliche Ingenieur prüft das Ergebnis.',
    summary: 'Qualitätsberichte und Spezifikationsprüfungen auf Basis technischer Unterlagen.',
    metaDescription:
      'Zeno für die Fertigung. 8D- und CAPA-Berichte erstellen, Spezifikationen vergleichen und Qualitätsfragen in einem kontrollierten Workspace beantworten.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Zeichnungen, Standards und Qualitätsunterlagen verbinden.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Mit einem vorgefertigten Agenten beginnen oder einen eigenen aufbauen.',
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
    workTitle: 'Ein Agent pro Dokument. Kein Assistent für das ganze Werk.',
    workBody:
      'Jeder Agent erhält ein Dokument, freigegebene Unterlagen und eine benannte Person für die Prüfung.',
    agents: [
      {
        name: 'Lieferantenqualitäts-Agent',
        does: 'Erstellt einen 8D-Entwurf aus der Reklamation und relevanten Qualitätsunterlagen.',
        from: 'Reklamationen, frühere 8D- und CAPA-Dateien sowie Lieferantenunterlagen',
      },
      {
        name: 'Spezifikations-Agent',
        does: 'Vergleicht Kundenzeichnungen mit dem internen Standard und belegt jede Abweichung.',
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
          'Ein Dokumenttyp in einem Werk bildet den Anfang. Nach der fachlichen Prüfung folgt die Erweiterung.',
      },
    ],
    closing: 'Mit dem Bericht beginnen, den das Qualitätsteam am häufigsten erstellt.',
  },
  'management-consulting': {
    navLabel: 'Unternehmensberatung',
    eyebrow: 'Unternehmensberatung',
    headline: 'Die Arbeit zwischen den Terminen.',
    subhead:
      'Angebote und Kundenunterlagen aus dem Wissen der Beratung erstellen. Jedes Mandat bleibt getrennt.',
    summary: 'Angebote und Kundenunterlagen auf Basis des Beratungswissens.',
    metaDescription:
      'Zeno für Unternehmensberatungen. Angebote erstellen, Interviews zusammenfassen und Kundenunterlagen mit mandatsbezogenem Zugriff aufbauen.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Briefing, Referenzen und passende frühere Projekte verbinden.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Mit einem vorgefertigten Agenten beginnen oder einen eigenen aufbauen.',
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
    workTitle: 'Die Arbeit vorbereiten. Die Beratung bleibt beim Team.',
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
        answer: 'Ein wiederkehrendes Angebot oder ein Kundenbericht bildet den Anfang.',
      },
    ],
    closing: 'Mit dem Angebot beginnen, das das Team regelmäßig neu aufbaut.',
  },
  'm-and-a': {
    navLabel: 'M&A',
    eyebrow: 'M&A',
    headline: 'Mehr Zeit für das Urteil hinter dem Deal.',
    subhead:
      'Zielunternehmen finden und qualifizierte Longlists vorbereiten. Berater prüfen jeden Kandidaten.',
    summary: 'Zielsuche und qualifizierte Longlists für M&A-Teams.',
    metaDescription:
      'Zeno für M&A. Zielunternehmen recherchieren, qualifizierte Longlists erstellen und Outreach mit verbundenem Wissen vorbereiten.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Suchkriterien, Sektorerfahrung und frühere Mandate verbinden.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Mit einem vorgefertigten Agenten beginnen oder einen eigenen aufbauen.',
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
        answer: 'Eine klare Suchthese und eine wiederkehrende Rechercheaufgabe bilden den Anfang.',
      },
    ],
    closing: 'Mit der Suche beginnen, die das Deal-Team gerade von Hand aufbaut.',
  },
  'private-equity': {
    navLabel: 'Private Equity',
    eyebrow: 'Private Equity',
    headline: 'Das Investment-Memo vor dem Investment Committee.',
    subhead: 'Marktanalyse, Unternehmenskontext und offene Due-Diligence-Fragen vorbereiten.',
    summary: 'Investment-Memos und offene Due-Diligence-Fragen mit verbundenem Wissen.',
    metaDescription:
      'Zeno für Investment-Teams. Investment-Memos, Marktanalysen und offene Due-Diligence-Fragen in einem kontrollierten Workspace vorbereiten.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Pitch Deck, Fondsstrategie und frühere Investments verbinden.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Mit einem vorgefertigten Agenten beginnen oder einen eigenen aufbauen.',
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
        answer: 'Offene Fragen bleiben im Memo sichtbar und mit den relevanten Quellen verbunden.',
      },
      {
        question: 'Kann bestehendes Fonds-Wissen einfließen?',
        answer: 'Ja, wenn es verbunden und für das Team freigegeben ist.',
      },
      {
        question: 'Wie starten wir?',
        answer: 'Ein wiederkehrendes Memo oder ein Teil der Due Diligence bildet den Anfang.',
      },
    ],
    closing: 'Mit dem Memo beginnen, das das Team als Nächstes vorbereitet.',
  },
  legal: {
    navLabel: 'Recht',
    eyebrow: 'Recht',
    headline: 'Der erste Vertragsentwurf im Abgleich mit dem eigenen Playbook.',
    subhead:
      'Verträge anhand eigener Klauseln und Richtlinien prüfen. Juristen behalten die Freigabe.',
    summary: 'Vertragsprüfung auf Basis des Playbooks einer Kanzlei oder Rechtsabteilung.',
    metaDescription:
      'Zeno für Rechtsteams. Verträge anhand des eigenen Playbooks prüfen, Klauselvorschläge erstellen und die juristische Freigabe behalten.',
    journey: [
      {
        title: 'Unternehmenskontext',
        description: 'Playbook, Vorlagen und freigegebene Präzedenzfälle verbinden.',
      },
      {
        title: 'Ausgangspunkt',
        description: 'Mit einem vorgefertigten Legal Agent beginnen oder einen eigenen aufbauen.',
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
    workTitle: 'Die Prüfung vorbereiten. Die Rechtsberatung bleibt beim Juristen.',
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
        answer: 'Ein Vertragstyp und ein klares Playbook bilden den Anfang.',
      },
    ],
    closing: 'Mit dem Vertrag beginnen, den das Team am häufigsten prüft.',
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
        label: 'früherer Aufwand pro Investmentmöglichkeit',
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
          'Vor der Einführung beanspruchte die Vorbereitung einer Investmentmöglichkeit typischerweise fünf bis zehn Stunden.',
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
