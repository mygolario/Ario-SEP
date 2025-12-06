import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { StartupPlan } from '@/lib/types';

// Register standard font if needed, or rely on default Helvetica
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2' });
// For now, using default fonts to avoid network dependency issues in this environment

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#111',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  text: {
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  roadmapItem: {
    marginLeft: 10,
    marginBottom: 2,
  },
  note: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#444',
  },
});

interface StrategyPdfProps {
  plan: StartupPlan;
  title: string;
}

export default function StrategyPdf({ plan, title }: StrategyPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{plan.summary.title}</Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.label}>ELEVATOR PITCH</Text>
          <Text style={styles.text}>{plan.summary.elevatorPitch}</Text>
          <Text style={styles.label}>CORE GOAL</Text>
          <Text style={styles.text}>{plan.summary.coreGoal}</Text>
        </View>

        {/* Key Blocks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Strategy Blocks</Text>
          <View style={styles.grid}>
            {plan.keyBlocks.map((block, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.cardTitle}>{block.label}</Text>
                <Text style={styles.text}>{block.content}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Roadmap */}
        <View style={styles.section} break>
          <Text style={styles.sectionTitle}>Execution Roadmap</Text>
          {plan.roadmap.map((phase, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{phase.label}</Text>
              {phase.items.map((item, j) => (
                <Text key={j} style={styles.roadmapItem}>• {item}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Notes */}
        {plan.notes && plan.notes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {plan.notes.map((note, i) => (
              <Text key={i} style={styles.note}>- {note}</Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
