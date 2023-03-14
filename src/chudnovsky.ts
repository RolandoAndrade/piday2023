import BigNumber from "bignumber.js";

/**
 * Chudnovsky algorithm
 * 1/π = 12∑((-1)^n(6n)!(A + Bn))/((n!)^3(3n)!C^(3n+3/2))
 * */

/**
 * Simplified formula.
 * π = D√EQ / (AQ + T)
 * */

const A = new BigNumber('13591409')
const B = new BigNumber('545140134')
const C = new BigNumber('640320')

const D = new BigNumber('426880')
const E = new BigNumber('10005')

const DIGITS_PER_ITERATION = new BigNumber('14.1816474627254776555')

// C^3/24
const C3_24 = C.multipliedBy(C).multipliedBy(C).dividedToIntegerBy(24)

async function computePQT(n1: BigNumber, n2: BigNumber) {
    let m = new BigNumber(0)
    let PQT = {
        P: new BigNumber(0),
        Q: new BigNumber(0),
        T: new BigNumber(0),
    }

    if (n1.plus(1).isEqualTo(n2)) {
        PQT.P = n2.multipliedBy(2).minus(1)
        PQT.P = PQT.P.multipliedBy(n2.multipliedBy(6).minus(1))
        PQT.P = PQT.P.multipliedBy(n2.multipliedBy(6).minus(5))
        PQT.Q = C3_24.multipliedBy(n2).multipliedBy(n2).multipliedBy(n2)
        PQT.T = A.plus(B.multipliedBy(n2)).multipliedBy(PQT.P)
        if (n2.modulo(2).isEqualTo(1)) {
            PQT.T = PQT.T.negated()
        }
    } else {
        m = n1.plus(n2).dividedToIntegerBy(2)
        let res1 = await new Promise<typeof PQT>((resolve) =>
            setTimeout(async () => resolve(await computePQT(n1, m)))
        )
        let res2 = await new Promise<typeof PQT>((resolve) =>
            setTimeout(async () => resolve(await computePQT(m, n2)))
        )
        PQT.P = res1.P.multipliedBy(res2.P)
        PQT.Q = res1.Q.multipliedBy(res2.Q)
        PQT.T = res1.T.multipliedBy(res2.Q).plus(res1.P.multipliedBy(res2.T))
    }

    return PQT
}

export async function pi(digits: number = 15) {
    const digitsBN = new BigNumber(digits)
    const batches = digitsBN.dividedToIntegerBy(DIGITS_PER_ITERATION).plus(1)
    const precision = digitsBN.multipliedBy(Math.log2(10))
    BigNumber.config({
        DECIMAL_PLACES: Math.ceil(precision.toNumber()),
        POW_PRECISION: Math.ceil(precision.toNumber()),
    });
    const PQT = await computePQT(new BigNumber(0), batches)

    let PI = D.multipliedBy(E.sqrt()).multipliedBy(PQT.Q)
    PI = PI.dividedBy(A.multipliedBy(PQT.Q).plus(PQT.T))

    return PI.toFixed(digits)
}