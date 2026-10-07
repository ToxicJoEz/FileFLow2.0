import mongoose from 'mongoose';

const searchEventSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['success', 'cancelled', 'error'],
    required: true
  },
  query_parameters: {
    keywords: { type: [String], default: [] },
    target_paths: { type: [String], default: [] },
    search_type: { type: String, default: 'standard' },
    fuzzy_tolerance: { type: Number, default: 1 },
    search_scope: { type: String, default: 'content' },
    file_types: { type: [String], default: [] },
    toggles: {
      match_all: { type: Boolean, default: false },
      case_sensitive: { type: Boolean, default: false },
      exact_match: { type: Boolean, default: false }
    },
    exclude_keywords: { type: [String], default: [] },
    filters: {
      date_filter: { type: String, default: 'any' },
      size_filter: { type: String, default: 'any' }
    }
  },
  analytics: {
    execution_time_ms: { type: Number, default: 0 },
    files_scanned: { type: Number, default: 0 },
    files_with_matches: { type: Number, default: 0 },
    total_keyword_hits: { type: Number, default: 0 },
    hits_by_extension: { type: Map, of: Number, default: {} },
    was_exported_to_excel: { type: Boolean, default: false },
    error_message: { type: String, default: '' }
  }
}, {
  timestamps: true
});

export default mongoose.model('SearchEvent', searchEventSchema);
