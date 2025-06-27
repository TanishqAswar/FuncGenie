// ============================================================================
// FILE: src/utils/typedefExpander.ts
// Typedef expansion utilities
// ============================================================================

export class TypedefExpander {
  private static readonly typeMap: { [key: string]: string } = {
    // Basic types
    ll: 'long long',

    // Vector types
    vi: 'vector<int>',
    vd: 'vector<double>',
    vf: 'vector<float>',
    vc: 'vector<char>',
    vs: 'vector<string>',
    vb: 'vector<bool>',
    vll: 'vector<long long>',

    // Vector of pairs
    vpi: 'vector<pair<int, int>>',
    vpd: 'vector<pair<double, double>>',
    vpl: 'vector<pair<long long, long long>>',
    vpc: 'vector<pair<char, char>>',
    vps: 'vector<pair<string, string>>',
    vpb: 'vector<pair<bool, bool>>',
    vpll: 'vector<pair<long long, long long>>',

    // Map types
    mii: 'map<int, int>',
    mid: 'map<int, double>',
    mil: 'map<int, long long>',
    mic: 'map<int, char>',
    mis: 'map<int, string>',
    mib: 'map<int, bool>',

    // Set types
    si: 'set<int>',
    sd: 'set<double>',
    sl: 'set<long long>',
    sc: 'set<char>',
    ss: 'set<string>',
    sb: 'set<bool>',

    // Pair types
    pii: 'pair<int, int>',
    pid: 'pair<int, double>',
    pil: 'pair<int, long long>',
    pic: 'pair<int, char>',
    pis: 'pair<int, string>',
    pib: 'pair<int, bool>',

    // Add more as needed...
  }

  static expand(shortType: string): string {
    if (shortType === 'long long') {
      return 'long long'
    }
    return this.typeMap[shortType] || shortType
  }
}
