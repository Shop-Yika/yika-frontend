/**
 * Auth protection is temporarily disabled for development.
 * Restore the full implementation from git history once dev accounts are set up.
 */

import { NextResponse } from 'next/server';

export default function proxy() {
    return NextResponse.next();
}
